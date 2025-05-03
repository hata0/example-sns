export class PostId {
  constructor(public readonly id: string | null) {}

  static createAsNull() {
    return new PostId(null);
  }
}
