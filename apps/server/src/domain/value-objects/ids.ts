export class PostId {
  constructor(public readonly value: string | null) {}

  static createAsNull() {
    return new PostId(null);
  }
}
