import {Checkable} from './base'

export class Store {
  private store = new Map()

  add(name:string, shape: Checkable) {
    this.store[name] = shape
  }

  ref(name:string) {
    return new Ref(this.get.bind(this, name))
  }

  get(name:string) {
    return this.store[name]
  }
}

export class Ref {
  private fn: () => Checkable
  constructor(fn:() => Checkable) {
    this.fn = fn
  }

  unref():Checkable {
    return this.fn()
  }
}
