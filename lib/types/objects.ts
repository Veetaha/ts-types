import { CanBeUndef, If } from './logical';
import { PickAsOptional } from './pick';


/**
 * Defines an object with keys of type `TKey`, and all values of `TValue` type.
 * @param TValue Type of values, stored in object's properties.
 * @param TKeys  Union type of keys stored in defined object type.
 *               It is `any` by default, if you use this parameter,
 *               most probably you will specify a union of some string or number unit types.
 */
export type Obj<
    TValue = any,
    TKeys extends PropertyKey = any
> = Record<TKeys, TValue>;

/**
 * Defines a union type of all the values stored in `TObj`.
 * @param TObj Object type to get values from.
 */
export type ValueOf<TObj extends Obj> = TObj[keyof TObj];

/**
 * Shorthand for `Extract<keyof TObj, string>`, i.e. it gets only those keys
 * that are assignable to `string` (without `number | symbol`)
 *
 * @param TObj Objet type to get string keys from.
 */
export type StrKeyOf<TObj extends Obj> = Extract<keyof TObj, string>;

/**
 * Same as BasicObject<>, but defines all properties as readonly.
 * @param TValue Type of values, stored in object's readonly properties.
 */
export type ReadonlyObj<
    TValue = unknown,
    TKey extends PropertyKey = any
> = Readonly<Obj<TValue, TKey>>;

/**
 * Defines the same object type as `TSrcObj`, but all values types
 * replaced with `TMappedValue` type.
 * @param TSrcObj       Type of object to take keys from.
 * @param TMappedValue  Type of values in the created object type.
 */
export type MapValues<
    TSrcObj extends Obj,
    TMappedValue
> = Obj<TMappedValue, keyof TSrcObj>;

/**
 * Defines the same object type as `TSrcObj`, but all values types
 * replaced with `TMappedValue` type **recursively**.
 * @param TSrcObj       Type of object to take keys from.
 * @param TMappedValue  Type of values in the created object type.
 */
export type DeepMapValues<
    TSrcObj extends Obj,
    TMappedValue
> = {
    [TKey in keyof TSrcObj]: TSrcObj[TKey] extends Obj
        ? DeepMapValues<TSrcObj[TKey], TMappedValue>
        : TMappedValue;
};


/**
 * Defines the same object type as `TSrcObj`, but with `TKeys` keys
 * having the value of type `TNewValue`.
 *
 * @param TSrcObj   Type of object to replace property type of.
 * @param TKeys     Union type of keys to change value types of (often just a string literal).
 * @param TNewValue Type of values stored at `TKeys` keys in the returned type.
 */
export type ReplaceValues<
    TSrcObj extends Obj,
    TKeys   extends keyof TSrcObj,
    TNewValue
> = Merge<TSrcObj, Obj<TNewValue, TKeys>>;

/**
 * Defines the same object type as `TSrcObj`, but without `TKeysUnion` keys.
 * @param TSrcObj    Type of object to remove keys from.
 * @param TKeysUnion A single or union type of keys to remove from `TSrcObj`.
 */
export type RemoveKeys<
    TSrcObj    extends Obj,
    TKeysUnion extends keyof TSrcObj
> = Pick<TSrcObj, Exclude<keyof TSrcObj, TKeysUnion>>;

/**
 * Defines the same object type as `TObj`, but with `TPrevKey` key renamed to `TNewKey`.
 * @param TObj     Object type to rename key in.
 * @param TPrevKey Target property key to rename.
 * @param TNewKey  New name (or symbol) for the `TObj[TPrevKey]` property.
 */
export type RenameKey<
    TObj     extends Obj,
    TPrevKey extends keyof TObj,
    TNewKey  extends PropertyKey
> = Merge<RemoveKeys<TObj, TPrevKey>, Obj<TObj[TPrevKey], TNewKey>>;

/**
 * Merge objects `TObj1` and `TObj2`.
 * Properties types from `TObj2` override the ones defined on `TObj1`.
 * This type is analogous to the return type of `Object.assign()`
 */
export type Merge<
    TObj1 extends Obj,
    TObj2 extends Obj
 > = Pick<TObj1, Exclude<keyof TObj1, keyof TObj2>> & TObj2;

/**
 * Defines the same type as `TObj`, but adds 'optional' modifier `?` to all
 * properties that allow `undefined` as their value type (this includes `unknown` and `any`).
 * @param TObj Target object type to take properties from.
 */
export type OptionalLikelyUndefProps<
    TObj extends Obj
> = Merge<TObj, PickLikelyUndefPropsAsOptional<TObj>>;

// Optimization
type PickLikelyUndefPropsAsOptional<TObj extends Obj> = PickAsOptional<
    TObj,
    ValueOf<{ [TKey in keyof TObj]-?: If<(CanBeUndef<TObj[TKey]>), TKey, never>; }>
>;
