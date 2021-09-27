import { DemoFile } from 'demofile';

import { logger } from '../../lib/logger';
import { IMatch } from '../../models/Match';

export default abstract class Detector {
  protected readonly demoFile: DemoFile;
  protected readonly logger = logger;
  protected match: IMatch;
  /**
   * When should this detector call it's save function?
   * Due to the complexity of our datastructures, we have to make sure we save the data in the correct order
   * priority = 0 highest priority, will run first
   */
  public abstract readonly savePriority: number;

  constructor(demoFile: DemoFile, match: IMatch) {
    this.demoFile = demoFile;
    this.match = match;
  }

  protected get currentTick() {
    return this.demoFile.currentTick;
  }

  protected getPlayerFromId(id) {
    return this.demoFile.entities.getByUserId(id);
  }

  protected get currentRound() {
    return this.match.rounds[this.match.rounds.length - 1];
  }

  protected get bomb() {
    return this.demoFile.entities.weapons.find(
      _ => _.className === 'weapon_c4'
    );
  }

  public abstract getName(): string;

  /**
   * Adjusts the match object. Data added in one detector can be used in others
   * Eg, one detector creates an array of players, another can link kills to players
   */
  public abstract calculate(): Promise<void>;

  /**
   * Saves all data added/modified by this detector. Note that this functions runs at the same time for all detectors
   */
  public abstract saveData(): Promise<void>;

  public async run(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.debug(`Running detector: ${this.getName()}`);
      const calcPromise = this.calculate();

      this.demoFile.on('end', () => {
        calcPromise.then(resolve).catch(reject);
      });
    });
  }
}
