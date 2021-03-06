import {Checkable} from './base'

export class TypeStore {
  private store = new Map()

  add(name:string, type: Checkable) {
    this.store[name] = type
  }

  ref(name:string) {
    return new Ref(this, name)
  }

  get(name:string) {
    return this.store[name]
  }
}

export class Ref {
  private store: TypeStore
  public readonly name:string
  constructor(store:TypeStore, name:string) {
    this.store = store
    this.name = name
  }

  unref():Checkable {
    return this.store.get(this.name)
  }
}

export function unref(type: Checkable|Ref):Checkable {
  if (type instanceof Ref) {
    return type.unref()
  }
  else {
    return type
  }
}
