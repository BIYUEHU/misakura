import minimist from 'minimist';
import { Assets } from 'PIXI.js';
import { parseArgs } from '@kotori-bot/tools';
import Visual from '../visual';
import State, { StateType } from './state';

type Command = ReturnType<(typeof Parser)['load']> extends Promise<infer U>
  ? U extends (infer E)[]
    ? E
    : never
  : never;
interface Operation {
  bg?: Command;
  text?: Command;
  music?: Command;
  chars: Record<string, Command>;
}

const COMMAND_OPTIONS: Record<string, Parameters<typeof minimist>[1]> = {
  say: {
    string: ['speaker', 'color'],
    alias: { speaker: 'S', color: 'C' },
    default: { speaker: 'think' },
  },
  /* TODO: new command: voice - bind character's voice file */
  character: {
    string: ['name', 'figure'],
    alias: { name: 'N', figure: 'F' },
  },
  show: {
    boolean: ['hide'],
    alias: { hide: 'H' },
  },
};

export class Parser {
  private static async load(script: string) {
    let handle = script;
    if (script.charAt(script.length - 1) === '/') handle = `${script}/main.mrs`;
    else if (script.split('.')[script.split('.').length - 1] !== 'mrs') handle = `${script}.mrs`;
    const text = await (await fetch(handle)).text();
    const lines = text
      .split(text.includes('\r\n') ? '\r\n' : '\n')
      .filter((line) => line.trim() && !line.trim().startsWith('#'));
    let lastSpeaker: string;
    return lines.map((line) => {
      let result = parseArgs(line.trim());
      if (!Array.isArray(result)) {
        throw new Error(JSON.stringify(result));
      }
      if (result[0].charAt(result[0].length - 1) === ':') {
        let speaker = result[0].substring(0, result[0].length - 1);
        if (speaker) lastSpeaker = speaker;
        else speaker = lastSpeaker;
        delete result[0];
        result = ['say', result.join(' ').trim(), '--speaker', speaker];
      }
      const options = COMMAND_OPTIONS[result[0] as keyof typeof COMMAND_OPTIONS];
      return minimist(result, options);
    });
  }

  /* TODO: base dir handle that is similar to node.js path module */
  /* TODO: audio: music, voice and sound */
  private static audio(command: Command) {
    const audio = new Audio(command._[1]);
    const step = 0.01;
    /* TODO: max volume extends game volume setting */
    const maxVolume = 0.5;
    const faceTime = 5;
    const interval = (faceTime / maxVolume) * step * 1000;
    audio.volume = 0;
    audio.loop = true;
    audio.onplaying = () => {
      const lastTime = State.getMusicTime();
      if (lastTime && lastTime < audio.duration) audio.currentTime = lastTime;
      const fadeInInterval = setInterval(() => {
        if (audio.volume >= maxVolume) {
          clearInterval(fadeInInterval);
          return;
        }
        const result = audio.volume + step;
        audio.volume = result > maxVolume ? maxVolume : result;
      }, interval);
      const setTimeInterval = setInterval(() => State.setMusicTime(audio.currentTime), 5000);
      const endTimer = setTimeout(() => {
        clearTimeout(endTimer);
        State.setMusicTime();
        clearInterval(setTimeInterval);
        const fadeOutInterval = setInterval(() => {
          if (audio.volume <= 0) {
            clearInterval(fadeOutInterval);
            return;
          }
          const result = audio.volume - step;
          audio.volume = result < 0 ? 0 : result;
        }, interval);
      }, (audio.duration - faceTime) * 1000);
    };
    audio.play();
    return audio;
  }

  private readonly ctx: Visual;

  private background(command: Command) {
    this.ctx.background(command._[1]);
  }

  private async character(command: Command) {
    const { name, figure, show } = command;
    await this.ctx.character(command._[1], { name, figure, show });
  }

  private async say(command: Command) {
    const { speaker } = command;
    if (speaker === 'think') {
      await this.ctx.text(command._[1]);
      return;
    }
    await this.ctx.elements.chars.get(speaker)?.text(command._[1]);
  }

  private async prehandle(commands: Command[], index0: number) {
    const operation: Operation = { chars: {} };
    const characterExists = (id: string) => {
      if (id === 'think' || id === 'unknown') return;
      if (id in operation.chars) return;
      console.warn(`Cannot find character "${id}"`);
    };
    commands.forEach((command, index) => {
      const { _: args } = command;
      switch (args[0]) {
        case 'background':
          if (index > index0) break;
          operation.bg = command;
          Assets.load(args[1]);
          break;
        /* TODO: change to audio and video */
        case 'play':
          if (index > index0) break;
          operation.music = command;
          Assets.load(args[1]);
          break;
        case 'say':
          if (index <= index0) operation.text = command;
          if (index <= index0 || State.debug) characterExists(command.speaker);
          break;
        case 'character':
          operation.chars[args[1]] = { ...(operation.chars[args[1]] ?? []), ...command };
          break;
        /* TODO: better debug to find question */
        case 'show':
          if (index <= index0 || State.debug) characterExists(args[1]);
          if (index <= index0) operation.chars[args[1]].show = !command.hide;
          break;
        default:
          if (!State.debug) break;
          console.warn(`Unknown command "${args[0]}" at ${index + 1} line`);
      }
    });
    if (operation.bg) this.background(operation.bg);
    if (operation.music) Parser.audio(operation.music);
    /* eslint-disable-next-line no-restricted-syntax */
    for await (const command of Object.values(operation.chars)) {
      await this.character(command);
    }
    if (operation.text) await this.say(operation.text);
  }

  private async nexthandle(commands: Command[]) {
    /* eslint-disable-next-line no-restricted-syntax */
    for await (const command of commands) {
      (State.get() as StateType['dialog']).index += 1;
      const { _: args } = command;
      switch (args[0]) {
        case 'background':
          this.background(command);
          break;
        case 'play':
          Parser.audio(command);
          break;
        case 'say':
          await this.say(command);
          break;
        case 'character':
          await this.character(command);
          break;
        case 'show':
          await this.character({ ...command, show: !command.hide });
          break;
        default:
      }
    }
  }

  public constructor(ctx: Visual) {
    this.ctx = ctx;
  }

  public async run() {
    const { script, index } = State.get() as StateType['dialog'];
    const commands = await Parser.load(script);
    if (commands.length <= index) throw new Error('script lines error');
    await this.prehandle(commands, index);
    await this.nexthandle(commands.splice(index + 1));
  }
}

export default Parser;
