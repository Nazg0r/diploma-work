import { LayerCollection } from '../../models/layers';
import { Command } from '../command.interface';

interface LayerStoreApi {
  addCollection(collection: LayerCollection): void;
  removeCollection(id: string): void;
}

export class AddCollectionCommand implements Command {
  public readonly id = 'add-collection';

  constructor(
    private readonly collection: LayerCollection,
    private readonly store: LayerStoreApi,
  ) {}

  public get label(): string {
    return `Add collection "${this.collection.name}"`;
  }

  execute(): void {
    this.store.addCollection(this.collection);
  }
  undo(): void {
    this.store.removeCollection(this.collection.id);
  }
}
