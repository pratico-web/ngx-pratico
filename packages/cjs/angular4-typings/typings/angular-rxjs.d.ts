
declare module "rxjs/util/isFunction" {
    export function isFunction(x: any): x is Function;
}
declare module "rxjs/Observer" {
    export interface NextObserver<T> {
        closed?: boolean;
        next: (value: T) => void;
        error?: (err: any) => void;
        complete?: () => void;
    }
    export interface ErrorObserver<T> {
        closed?: boolean;
        next?: (value: T) => void;
        error: (err: any) => void;
        complete?: () => void;
    }
    export interface CompletionObserver<T> {
        closed?: boolean;
        next?: (value: T) => void;
        error?: (err: any) => void;
        complete: () => void;
    }
    export type PartialObserver<T> = NextObserver<T> | ErrorObserver<T> | CompletionObserver<T>;
    export interface Observer<T> {
        closed?: boolean;
        next: (value: T) => void;
        error: (err: any) => void;
        complete: () => void;
    }
    export const empty: Observer<any>;
}
declare module "rxjs/util/isArray" {
    export const isArray: (arg: any) => arg is any[];
}
declare module "rxjs/util/isObject" {
    export function isObject(x: any): x is Object;
}
declare module "rxjs/util/errorObject" {
    export const errorObject: any;
}
declare module "rxjs/util/tryCatch" {
    export function tryCatch<T extends Function>(fn: T): T;
}
declare module "rxjs/util/UnsubscriptionError" {
    /**
     * An error thrown when one or more errors have occurred during the
     * `unsubscribe` of a {@link Subscription}.
     */
    export class UnsubscriptionError extends Error {
        errors: any[];
        constructor(errors: any[]);
    }
}
declare module "rxjs/Subscription" {
    export interface AnonymousSubscription {
        unsubscribe(): void;
    }
    export type TeardownLogic = AnonymousSubscription | Function | void;
    export interface ISubscription extends AnonymousSubscription {
        unsubscribe(): void;
        readonly closed: boolean;
    }
    /**
     * Represents a disposable resource, such as the execution of an Observable. A
     * Subscription has one important method, `unsubscribe`, that takes no argument
     * and just disposes the resource held by the subscription.
     *
     * Additionally, subscriptions may be grouped together through the `add()`
     * method, which will attach a child Subscription to the current Subscription.
     * When a Subscription is unsubscribed, all its children (and its grandchildren)
     * will be unsubscribed as well.
     *
     * @class Subscription
     */
    export class Subscription implements ISubscription {
        static EMPTY: Subscription;
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        closed: boolean;
        protected _parent: Subscription;
        protected _parents: Subscription[];
        private _subscriptions;
        /**
         * @param {function(): void} [unsubscribe] A function describing how to
         * perform the disposal of resources when the `unsubscribe` method is called.
         */
        constructor(unsubscribe?: () => void);
        /**
         * Disposes the resources held by the subscription. May, for instance, cancel
         * an ongoing Observable execution or cancel any other type of work that
         * started when the Subscription was created.
         * @return {void}
         */
        unsubscribe(): void;
        /**
         * Adds a tear down to be called during the unsubscribe() of this
         * Subscription.
         *
         * If the tear down being added is a subscription that is already
         * unsubscribed, is the same reference `add` is being called on, or is
         * `Subscription.EMPTY`, it will not be added.
         *
         * If this subscription is already in an `closed` state, the passed
         * tear down logic will be executed immediately.
         *
         * @param {TeardownLogic} teardown The additional logic to execute on
         * teardown.
         * @return {Subscription} Returns the Subscription used or created to be
         * added to the inner subscriptions list. This Subscription can be used with
         * `remove()` to remove the passed teardown logic from the inner subscriptions
         * list.
         */
        add(teardown: TeardownLogic): Subscription;
        /**
         * Removes a Subscription from the internal list of subscriptions that will
         * unsubscribe during the unsubscribe process of this Subscription.
         * @param {Subscription} subscription The subscription to remove.
         * @return {void}
         */
        remove(subscription: Subscription): void;
        private _addParent(parent);
    }
}
declare module "rxjs/util/root" {
    /**
     * window: browser in DOM main thread
     * self: browser in WebWorker
     * global: Node.js/other
     */
    export let root: any;
}
declare module "rxjs/symbol/rxSubscriber" {
    export const rxSubscriber: any;
    /**
     * @deprecated use rxSubscriber instead
     */
    export const $$rxSubscriber: any;
}
declare module "rxjs/Subscriber" {
    import { Observer, PartialObserver } from "rxjs/Observer";
    import { Subscription } from "rxjs/Subscription";
    /**
     * Implements the {@link Observer} interface and extends the
     * {@link Subscription} class. While the {@link Observer} is the public API for
     * consuming the values of an {@link Observable}, all Observers get converted to
     * a Subscriber, in order to provide Subscription-like capabilities such as
     * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
     * implementing operators, but it is rarely used as a public API.
     *
     * @class Subscriber<T>
     */
    export class Subscriber<T> extends Subscription implements Observer<T> {
        /**
         * A static factory for a Subscriber, given a (potentially partial) definition
         * of an Observer.
         * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
         * @param {function(e: ?any): void} [error] The `error` callback of an
         * Observer.
         * @param {function(): void} [complete] The `complete` callback of an
         * Observer.
         * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
         * Observer represented by the given arguments.
         */
        static create<T>(next?: (x?: T) => void, error?: (e?: any) => void, complete?: () => void): Subscriber<T>;
        syncErrorValue: any;
        syncErrorThrown: boolean;
        syncErrorThrowable: boolean;
        protected isStopped: boolean;
        protected destination: PartialObserver<any>;
        /**
         * @param {Observer|function(value: T): void} [destinationOrNext] A partially
         * defined Observer or a `next` callback function.
         * @param {function(e: ?any): void} [error] The `error` callback of an
         * Observer.
         * @param {function(): void} [complete] The `complete` callback of an
         * Observer.
         */
        constructor(destinationOrNext?: PartialObserver<any> | ((value: T) => void), error?: (e?: any) => void, complete?: () => void);
        /**
         * The {@link Observer} callback to receive notifications of type `next` from
         * the Observable, with a value. The Observable may call this method 0 or more
         * times.
         * @param {T} [value] The `next` value.
         * @return {void}
         */
        next(value?: T): void;
        /**
         * The {@link Observer} callback to receive notifications of type `error` from
         * the Observable, with an attached {@link Error}. Notifies the Observer that
         * the Observable has experienced an error condition.
         * @param {any} [err] The `error` exception.
         * @return {void}
         */
        error(err?: any): void;
        /**
         * The {@link Observer} callback to receive a valueless notification of type
         * `complete` from the Observable. Notifies the Observer that the Observable
         * has finished sending push-based notifications.
         * @return {void}
         */
        complete(): void;
        unsubscribe(): void;
        protected _next(value: T): void;
        protected _error(err: any): void;
        protected _complete(): void;
        protected _unsubscribeAndRecycle(): Subscriber<T>;
    }
}
declare module "rxjs/Operator" {
    import { Subscriber } from "rxjs/Subscriber";
    import { TeardownLogic } from "rxjs/Subscription";
    export interface Operator<T, R> {
        call(subscriber: Subscriber<R>, source: any): TeardownLogic;
    }
}
declare module "rxjs/util/toSubscriber" {
    import { Subscriber } from "rxjs/Subscriber";
    import { PartialObserver } from "rxjs/Observer";
    export function toSubscriber<T>(nextOrObserver?: PartialObserver<T> | ((value: T) => void), error?: (error: any) => void, complete?: () => void): Subscriber<T>;
}
declare module "rxjs/util/isArrayLike" {
    export const isArrayLike: <T>(x: any) => x is ArrayLike<T>;
}
declare module "rxjs/util/isPromise" {
    export function isPromise<T>(value: any | Promise<T>): value is Promise<T>;
}
declare module "rxjs/symbol/iterator" {
    export function symbolIteratorPonyfill(root: any): any;
    export const iterator: any;
    /**
     * @deprecated use iterator instead
     */
    export const $$iterator: any;
}
declare module "rxjs/OuterSubscriber" {
    import { Subscriber } from "rxjs/Subscriber";
    import { InnerSubscriber } from "rxjs/InnerSubscriber";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class OuterSubscriber<T, R> extends Subscriber<T> {
        notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
        notifyError(error: any, innerSub: InnerSubscriber<T, R>): void;
        notifyComplete(innerSub: InnerSubscriber<T, R>): void;
    }
}
declare module "rxjs/InnerSubscriber" {
    import { Subscriber } from "rxjs/Subscriber";
    import { OuterSubscriber } from "rxjs/OuterSubscriber";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class InnerSubscriber<T, R> extends Subscriber<R> {
        private parent;
        private outerValue;
        private outerIndex;
        private index;
        constructor(parent: OuterSubscriber<T, R>, outerValue: T, outerIndex: number);
        protected _next(value: R): void;
        protected _error(error: any): void;
        protected _complete(): void;
    }
}
declare module "rxjs/symbol/observable" {
    export function getSymbolObservable(context: any): any;
    export const observable: any;
    /**
     * @deprecated use observable instead
     */
    export const $$observable: any;
}
declare module "rxjs/util/subscribeToResult" {
    import { Subscription } from "rxjs/Subscription";
    import { OuterSubscriber } from "rxjs/OuterSubscriber";
    export function subscribeToResult<T, R>(outerSubscriber: OuterSubscriber<T, R>, result: any, outerValue?: T, outerIndex?: number): Subscription;
}
declare module "rxjs/observable/IfObservable" {
    import { Observable, SubscribableOrPromise } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { TeardownLogic } from "rxjs/Subscription";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class IfObservable<T, R> extends Observable<T> {
        private condition;
        private thenSource;
        private elseSource;
        static create<T, R>(condition: () => boolean | void, thenSource?: SubscribableOrPromise<T> | void, elseSource?: SubscribableOrPromise<R> | void): Observable<T | R>;
        constructor(condition: () => boolean | void, thenSource?: SubscribableOrPromise<T> | void, elseSource?: SubscribableOrPromise<R> | void);
        protected _subscribe(subscriber: Subscriber<T | R>): TeardownLogic;
    }
}
declare module "rxjs/scheduler/Action" {
    import { Scheduler } from "rxjs/Scheduler";
    import { Subscription } from "rxjs/Subscription";
    /**
     * A unit of work to be executed in a {@link Scheduler}. An action is typically
     * created from within a Scheduler and an RxJS user does not need to concern
     * themselves about creating and manipulating an Action.
     *
     * ```ts
     * class Action<T> extends Subscription {
     *   new (scheduler: Scheduler, work: (state?: T) => void);
     *   schedule(state?: T, delay: number = 0): Subscription;
     * }
     * ```
     *
     * @class Action<T>
     */
    export class Action<T> extends Subscription {
        constructor(scheduler: Scheduler, work: (this: Action<T>, state?: T) => void);
        /**
         * Schedules this action on its parent Scheduler for execution. May be passed
         * some context object, `state`. May happen at some point in the future,
         * according to the `delay` parameter, if specified.
         * @param {T} [state] Some contextual data that the `work` function uses when
         * called by the Scheduler.
         * @param {number} [delay] Time to wait before executing the work, where the
         * time unit is implicit and defined by the Scheduler.
         * @return {void}
         */
        schedule(state?: T, delay?: number): Subscription;
    }
}
declare module "rxjs/Scheduler" {
    import { Action } from "rxjs/scheduler/Action";
    import { Subscription } from "rxjs/Subscription";
    export interface IScheduler {
        now(): number;
        schedule<T>(work: (this: Action<T>, state?: T) => void, delay?: number, state?: T): Subscription;
    }
    /**
     * An execution context and a data structure to order tasks and schedule their
     * execution. Provides a notion of (potentially virtual) time, through the
     * `now()` getter method.
     *
     * Each unit of work in a Scheduler is called an {@link Action}.
     *
     * ```ts
     * class Scheduler {
     *   now(): number;
     *   schedule(work, delay?, state?): Subscription;
     * }
     * ```
     *
     * @class Scheduler
     */
    export class Scheduler implements IScheduler {
        private SchedulerAction;
        static now: () => number;
        constructor(SchedulerAction: typeof Action, now?: () => number);
        /**
         * A getter method that returns a number representing the current time
         * (at the time this function was called) according to the scheduler's own
         * internal clock.
         * @return {number} A number that represents the current time. May or may not
         * have a relation to wall-clock time. May or may not refer to a time unit
         * (e.g. milliseconds).
         */
        now: () => number;
        /**
         * Schedules a function, `work`, for execution. May happen at some point in
         * the future, according to the `delay` parameter, if specified. May be passed
         * some context object, `state`, which will be passed to the `work` function.
         *
         * The given arguments will be processed an stored as an Action object in a
         * queue of actions.
         *
         * @param {function(state: ?T): ?Subscription} work A function representing a
         * task, or some unit of work to be executed by the Scheduler.
         * @param {number} [delay] Time to wait before executing the work, where the
         * time unit is implicit and defined by the Scheduler itself.
         * @param {T} [state] Some contextual data that the `work` function uses when
         * called by the Scheduler.
         * @return {Subscription} A subscription in order to be able to unsubscribe
         * the scheduled work.
         */
        schedule<T>(work: (this: Action<T>, state?: T) => void, delay?: number, state?: T): Subscription;
    }
}
declare module "rxjs/observable/ErrorObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    import { TeardownLogic } from "rxjs/Subscription";
    export interface DispatchArg {
        error: any;
        subscriber: any;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class ErrorObservable extends Observable<any> {
        error: any;
        private scheduler;
        /**
         * Creates an Observable that emits no items to the Observer and immediately
         * emits an error notification.
         *
         * <span class="informal">Just emits 'error', and nothing else.
         * </span>
         *
         * <img src="./img/throw.png" width="100%">
         *
         * This static operator is useful for creating a simple Observable that only
         * emits the error notification. It can be used for composing with other
         * Observables, such as in a {@link mergeMap}.
         *
         * @example <caption>Emit the number 7, then emit an error.</caption>
         * var result = Rx.Observable.throw(new Error('oops!')).startWith(7);
         * result.subscribe(x => console.log(x), e => console.error(e));
         *
         * @example <caption>Map and flatten numbers to the sequence 'a', 'b', 'c', but throw an error for 13</caption>
         * var interval = Rx.Observable.interval(1000);
         * var result = interval.mergeMap(x =>
         *   x === 13 ?
         *     Rx.Observable.throw('Thirteens are bad') :
         *     Rx.Observable.of('a', 'b', 'c')
         * );
         * result.subscribe(x => console.log(x), e => console.error(e));
         *
         * @see {@link create}
         * @see {@link empty}
         * @see {@link never}
         * @see {@link of}
         *
         * @param {any} error The particular Error to pass to the error notification.
         * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
         * the emission of the error notification.
         * @return {Observable} An error Observable: emits only the error notification
         * using the given error argument.
         * @static true
         * @name throw
         * @owner Observable
         */
        static create(error: any, scheduler?: IScheduler): ErrorObservable;
        static dispatch(arg: DispatchArg): void;
        constructor(error: any, scheduler?: IScheduler);
        protected _subscribe(subscriber: any): TeardownLogic;
    }
}
declare module "rxjs/Observable" {
    import { PartialObserver } from "rxjs/Observer";
    import { Operator } from "rxjs/Operator";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription, AnonymousSubscription, TeardownLogic } from "rxjs/Subscription";
    import { IfObservable } from "rxjs/observable/IfObservable";
    import { ErrorObservable } from "rxjs/observable/ErrorObservable";
    export interface Subscribable<T> {
        subscribe(observerOrNext?: PartialObserver<T> | ((value: T) => void), error?: (error: any) => void, complete?: () => void): AnonymousSubscription;
    }
    export type SubscribableOrPromise<T> = Subscribable<T> | PromiseLike<T>;
    export type ObservableInput<T> = SubscribableOrPromise<T> | ArrayLike<T>;
    /**
     * A representation of any set of values over any amount of time. This the most basic building block
     * of RxJS.
     *
     * @class Observable<T>
     */
    export class Observable<T> implements Subscribable<T> {
        _isScalar: boolean;
        protected source: Observable<any>;
        protected operator: Operator<any, T>;
        /**
         * @constructor
         * @param {Function} subscribe the function that is  called when the Observable is
         * initially subscribed to. This function is given a Subscriber, to which new values
         * can be `next`ed, or an `error` method can be called to raise an error, or
         * `complete` can be called to notify of a successful completion.
         */
        constructor(subscribe?: (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic);
        /**
         * Creates a new cold Observable by calling the Observable constructor
         * @static true
         * @owner Observable
         * @method create
         * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
         * @return {Observable} a new cold observable
         */
        static create: Function;
        /**
         * Creates a new Observable, with this Observable as the source, and the passed
         * operator defined as the new observable's operator.
         * @method lift
         * @param {Operator} operator the operator defining the operation to take on the observable
         * @return {Observable} a new observable with the Operator applied
         */
        lift<R>(operator: Operator<T, R>): Observable<R>;
        /**
         * Registers handlers for handling emitted values, error and completions from the observable, and
         *  executes the observable's subscriber function, which will take action to set up the underlying data stream
         * @method subscribe
         * @param {PartialObserver|Function} observerOrNext (optional) either an observer defining all functions to be called,
         *  or the first of three possible handlers, which is the handler for each value emitted from the observable.
         * @param {Function} error (optional) a handler for a terminal event resulting from an error. If no error handler is provided,
         *  the error will be thrown as unhandled
         * @param {Function} complete (optional) a handler for a terminal event resulting from successful completion.
         * @return {ISubscription} a subscription reference to the registered handlers
         */
        subscribe(): Subscription;
        subscribe(observer: PartialObserver<T>): Subscription;
        subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription;
        protected _trySubscribe(sink: Subscriber<T>): TeardownLogic;
        /**
         * @method forEach
         * @param {Function} next a handler for each value emitted by the observable
         * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
         * @return {Promise} a promise that either resolves on observable completion or
         *  rejects with the handled error
         */
        forEach(next: (value: T) => void, PromiseCtor?: typeof Promise): Promise<void>;
        protected _subscribe(subscriber: Subscriber<any>): TeardownLogic;
        static if: typeof IfObservable.create;
        static throw: typeof ErrorObservable.create;
    }
}
declare module "rxjs/util/ObjectUnsubscribedError" {
    /**
     * An error thrown when an action is invalid because the object has been
     * unsubscribed.
     *
     * @see {@link Subject}
     * @see {@link BehaviorSubject}
     *
     * @class ObjectUnsubscribedError
     */
    export class ObjectUnsubscribedError extends Error {
        constructor();
    }
}
declare module "rxjs/SubjectSubscription" {
    import { Subject } from "rxjs/Subject";
    import { Observer } from "rxjs/Observer";
    import { Subscription } from "rxjs/Subscription";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class SubjectSubscription<T> extends Subscription {
        subject: Subject<T>;
        subscriber: Observer<T>;
        closed: boolean;
        constructor(subject: Subject<T>, subscriber: Observer<T>);
        unsubscribe(): void;
    }
}
declare module "rxjs/Subject" {
    import { Operator } from "rxjs/Operator";
    import { Observer } from "rxjs/Observer";
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { ISubscription, Subscription, TeardownLogic } from "rxjs/Subscription";
    /**
     * @class SubjectSubscriber<T>
     */
    export class SubjectSubscriber<T> extends Subscriber<T> {
        protected destination: Subject<T>;
        constructor(destination: Subject<T>);
    }
    /**
     * @class Subject<T>
     */
    export class Subject<T> extends Observable<T> implements ISubscription {
        observers: Observer<T>[];
        closed: boolean;
        isStopped: boolean;
        hasError: boolean;
        thrownError: any;
        constructor();
        static create: Function;
        lift<R>(operator: Operator<T, R>): Observable<T>;
        next(value?: T): void;
        error(err: any): void;
        complete(): void;
        unsubscribe(): void;
        protected _trySubscribe(subscriber: Subscriber<T>): TeardownLogic;
        protected _subscribe(subscriber: Subscriber<T>): Subscription;
        asObservable(): Observable<T>;
    }
    /**
     * @class AnonymousSubject<T>
     */
    export class AnonymousSubject<T> extends Subject<T> {
        protected destination: Observer<T>;
        constructor(destination?: Observer<T>, source?: Observable<T>);
        next(value: T): void;
        error(err: any): void;
        complete(): void;
        protected _subscribe(subscriber: Subscriber<T>): Subscription;
    }
}
declare module "rxjs/AsyncSubject" {
    import { Subject } from "rxjs/Subject";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    /**
     * @class AsyncSubject<T>
     */
    export class AsyncSubject<T> extends Subject<T> {
        private value;
        private hasNext;
        private hasCompleted;
        protected _subscribe(subscriber: Subscriber<any>): Subscription;
        next(value: T): void;
        error(error: any): void;
        complete(): void;
    }
}
declare module "rxjs/observable/BoundCallbackObservable" {
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    import { IScheduler } from "rxjs/Scheduler";
    import { AsyncSubject } from "rxjs/AsyncSubject";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class BoundCallbackObservable<T> extends Observable<T> {
        private callbackFunc;
        private selector;
        private args;
        private context;
        private scheduler;
        subject: AsyncSubject<T>;
        static create(callbackFunc: (callback: () => any) => any, selector?: void, scheduler?: IScheduler): () => Observable<void>;
        static create<R>(callbackFunc: (callback: (result: R) => any) => any, selector?: void, scheduler?: IScheduler): () => Observable<R>;
        static create<T, R>(callbackFunc: (v1: T, callback: (result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T) => Observable<R>;
        static create<T, T2, R>(callbackFunc: (v1: T, v2: T2, callback: (result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T, v2: T2) => Observable<R>;
        static create<T, T2, T3, R>(callbackFunc: (v1: T, v2: T2, v3: T3, callback: (result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3) => Observable<R>;
        static create<T, T2, T3, T4, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, callback: (result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3, v4: T4) => Observable<R>;
        static create<T, T2, T3, T4, T5, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, callback: (result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => Observable<R>;
        static create<T, T2, T3, T4, T5, T6, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, callback: (result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => Observable<R>;
        static create<R>(callbackFunc: (callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: IScheduler): () => Observable<R>;
        static create<T, R>(callbackFunc: (v1: T, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: IScheduler): (v1: T) => Observable<R>;
        static create<T, T2, R>(callbackFunc: (v1: T, v2: T2, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: IScheduler): (v1: T, v2: T2) => Observable<R>;
        static create<T, T2, T3, R>(callbackFunc: (v1: T, v2: T2, v3: T3, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3) => Observable<R>;
        static create<T, T2, T3, T4, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3, v4: T4) => Observable<R>;
        static create<T, T2, T3, T4, T5, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => Observable<R>;
        static create<T, T2, T3, T4, T5, T6, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, callback: (...args: any[]) => any) => any, selector: (...args: any[]) => R, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => Observable<R>;
        static create<T>(callbackFunc: Function, selector?: void, scheduler?: IScheduler): (...args: any[]) => Observable<T>;
        static create<T>(callbackFunc: Function, selector?: (...args: any[]) => T, scheduler?: IScheduler): (...args: any[]) => Observable<T>;
        constructor(callbackFunc: Function, selector: Function, args: any[], context: any, scheduler: IScheduler);
        protected _subscribe(subscriber: Subscriber<T | T[]>): Subscription;
        static dispatch<T>(state: {
            source: BoundCallbackObservable<T>;
            subscriber: Subscriber<T>;
            context: any;
        }): void;
    }
}
declare module "rxjs/observable/bindCallback" {
    import { BoundCallbackObservable } from "rxjs/observable/BoundCallbackObservable";
    export const bindCallback: typeof BoundCallbackObservable.create;
}
declare module "rxjs/add/observable/bindCallback" {
    import { bindCallback as staticBindCallback } from "rxjs/observable/bindCallback";
    module "Observable" {
        namespace Observable {
            let bindCallback: typeof staticBindCallback;
        }
    }
}
declare module "rxjs/observable/BoundNodeCallbackObservable" {
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    import { IScheduler } from "rxjs/Scheduler";
    import { AsyncSubject } from "rxjs/AsyncSubject";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class BoundNodeCallbackObservable<T> extends Observable<T> {
        private callbackFunc;
        private selector;
        private args;
        private context;
        scheduler: IScheduler;
        subject: AsyncSubject<T>;
        static create<R>(callbackFunc: (callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: IScheduler): () => Observable<R>;
        static create<T, R>(callbackFunc: (v1: T, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T) => Observable<R>;
        static create<T, T2, R>(callbackFunc: (v1: T, v2: T2, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T, v2: T2) => Observable<R>;
        static create<T, T2, T3, R>(callbackFunc: (v1: T, v2: T2, v3: T3, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3) => Observable<R>;
        static create<T, T2, T3, T4, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3, v4: T4) => Observable<R>;
        static create<T, T2, T3, T4, T5, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => Observable<R>;
        static create<T, T2, T3, T4, T5, T6, R>(callbackFunc: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6, callback: (err: any, result: R) => any) => any, selector?: void, scheduler?: IScheduler): (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => Observable<R>;
        static create<T>(callbackFunc: Function, selector?: void, scheduler?: IScheduler): (...args: any[]) => Observable<T>;
        static create<T>(callbackFunc: Function, selector?: (...args: any[]) => T, scheduler?: IScheduler): (...args: any[]) => Observable<T>;
        constructor(callbackFunc: Function, selector: Function, args: any[], context: any, scheduler: IScheduler);
        protected _subscribe(subscriber: Subscriber<T | T[]>): Subscription;
    }
}
declare module "rxjs/observable/bindNodeCallback" {
    import { BoundNodeCallbackObservable } from "rxjs/observable/BoundNodeCallbackObservable";
    export const bindNodeCallback: typeof BoundNodeCallbackObservable.create;
}
declare module "rxjs/add/observable/bindNodeCallback" {
    import { bindNodeCallback as staticBindNodeCallback } from "rxjs/observable/bindNodeCallback";
    module "Observable" {
        namespace Observable {
            let bindNodeCallback: typeof staticBindNodeCallback;
        }
    }
}
declare module "rxjs/util/isScheduler" {
    import { Scheduler } from "rxjs/Scheduler";
    export function isScheduler(value: any): value is Scheduler;
}
declare module "rxjs/observable/ScalarObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { TeardownLogic } from "rxjs/Subscription";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class ScalarObservable<T> extends Observable<T> {
        value: T;
        private scheduler;
        static create<T>(value: T, scheduler?: IScheduler): ScalarObservable<T>;
        static dispatch(state: any): void;
        _isScalar: boolean;
        constructor(value: T, scheduler?: IScheduler);
        protected _subscribe(subscriber: Subscriber<T>): TeardownLogic;
    }
}
declare module "rxjs/observable/EmptyObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Subscriber } from "rxjs/Subscriber";
    import { Observable } from "rxjs/Observable";
    import { TeardownLogic } from "rxjs/Subscription";
    export interface DispatchArg<T> {
        subscriber: Subscriber<T>;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class EmptyObservable<T> extends Observable<T> {
        private scheduler;
        /**
         * Creates an Observable that emits no items to the Observer and immediately
         * emits a complete notification.
         *
         * <span class="informal">Just emits 'complete', and nothing else.
         * </span>
         *
         * <img src="./img/empty.png" width="100%">
         *
         * This static operator is useful for creating a simple Observable that only
         * emits the complete notification. It can be used for composing with other
         * Observables, such as in a {@link mergeMap}.
         *
         * @example <caption>Emit the number 7, then complete.</caption>
         * var result = Rx.Observable.empty().startWith(7);
         * result.subscribe(x => console.log(x));
         *
         * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
         * var interval = Rx.Observable.interval(1000);
         * var result = interval.mergeMap(x =>
         *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
         * );
         * result.subscribe(x => console.log(x));
         *
         * // Results in the following to the console:
         * // x is equal to the count on the interval eg(0,1,2,3,...)
         * // x will occur every 1000ms
         * // if x % 2 is equal to 1 print abc
         * // if x % 2 is not equal to 1 nothing will be output
         *
         * @see {@link create}
         * @see {@link never}
         * @see {@link of}
         * @see {@link throw}
         *
         * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
         * the emission of the complete notification.
         * @return {Observable} An "empty" Observable: emits only the complete
         * notification.
         * @static true
         * @name empty
         * @owner Observable
         */
        static create<T>(scheduler?: IScheduler): Observable<T>;
        static dispatch<T>(arg: DispatchArg<T>): void;
        constructor(scheduler?: IScheduler);
        protected _subscribe(subscriber: Subscriber<T>): TeardownLogic;
    }
}
declare module "rxjs/observable/ArrayObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { TeardownLogic } from "rxjs/Subscription";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class ArrayObservable<T> extends Observable<T> {
        private array;
        private scheduler;
        static create<T>(array: T[], scheduler?: IScheduler): Observable<T>;
        static of<T>(item1: T, scheduler?: IScheduler): Observable<T>;
        static of<T>(item1: T, item2: T, scheduler?: IScheduler): Observable<T>;
        static of<T>(item1: T, item2: T, item3: T, scheduler?: IScheduler): Observable<T>;
        static of<T>(item1: T, item2: T, item3: T, item4: T, scheduler?: IScheduler): Observable<T>;
        static of<T>(item1: T, item2: T, item3: T, item4: T, item5: T, scheduler?: IScheduler): Observable<T>;
        static of<T>(item1: T, item2: T, item3: T, item4: T, item5: T, item6: T, scheduler?: IScheduler): Observable<T>;
        static of<T>(...array: Array<T | IScheduler>): Observable<T>;
        static dispatch(state: any): void;
        value: any;
        constructor(array: T[], scheduler?: IScheduler);
        protected _subscribe(subscriber: Subscriber<T>): TeardownLogic;
    }
}
declare module "rxjs/operator/combineLatest" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    import { Operator } from "rxjs/Operator";
    import { Subscriber } from "rxjs/Subscriber";
    import { OuterSubscriber } from "rxjs/OuterSubscriber";
    import { InnerSubscriber } from "rxjs/InnerSubscriber";
    export function combineLatest<T, R>(this: Observable<T>, project: (v1: T) => R): Observable<R>;
    export function combineLatest<T, T2, R>(this: Observable<T>, v2: ObservableInput<T2>, project: (v1: T, v2: T2) => R): Observable<R>;
    export function combineLatest<T, T2, T3, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, project: (v1: T, v2: T2, v3: T3) => R): Observable<R>;
    export function combineLatest<T, T2, T3, T4, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, project: (v1: T, v2: T2, v3: T3, v4: T4) => R): Observable<R>;
    export function combineLatest<T, T2, T3, T4, T5, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => R): Observable<R>;
    export function combineLatest<T, T2, T3, T4, T5, T6, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => R): Observable<R>;
    export function combineLatest<T, T2>(this: Observable<T>, v2: ObservableInput<T2>): Observable<[T, T2]>;
    export function combineLatest<T, T2, T3>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<[T, T2, T3]>;
    export function combineLatest<T, T2, T3, T4>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<[T, T2, T3, T4]>;
    export function combineLatest<T, T2, T3, T4, T5>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<[T, T2, T3, T4, T5]>;
    export function combineLatest<T, T2, T3, T4, T5, T6>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
    export function combineLatest<T, R>(this: Observable<T>, ...observables: Array<ObservableInput<T> | ((...values: Array<T>) => R)>): Observable<R>;
    export function combineLatest<T, R>(this: Observable<T>, array: ObservableInput<T>[]): Observable<Array<T>>;
    export function combineLatest<T, TOther, R>(this: Observable<T>, array: ObservableInput<TOther>[], project: (v1: T, ...values: Array<TOther>) => R): Observable<R>;
    export class CombineLatestOperator<T, R> implements Operator<T, R> {
        private project;
        constructor(project?: (...values: Array<any>) => R);
        call(subscriber: Subscriber<R>, source: any): any;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class CombineLatestSubscriber<T, R> extends OuterSubscriber<T, R> {
        private project;
        private active;
        private values;
        private observables;
        private toRespond;
        constructor(destination: Subscriber<R>, project?: (...values: Array<any>) => R);
        protected _next(observable: any): void;
        protected _complete(): void;
        notifyComplete(unused: Subscriber<R>): void;
        notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
        private _tryProject(values);
    }
}
declare module "rxjs/observable/combineLatest" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    import { IScheduler } from "rxjs/Scheduler";
    export function combineLatest<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>, scheduler?: IScheduler): Observable<[T, T2]>;
    export function combineLatest<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, scheduler?: IScheduler): Observable<[T, T2, T3]>;
    export function combineLatest<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, scheduler?: IScheduler): Observable<[T, T2, T3, T4]>;
    export function combineLatest<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, scheduler?: IScheduler): Observable<[T, T2, T3, T4, T5]>;
    export function combineLatest<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, scheduler?: IScheduler): Observable<[T, T2, T3, T4, T5, T6]>;
    export function combineLatest<T, R>(v1: ObservableInput<T>, project: (v1: T) => R, scheduler?: IScheduler): Observable<R>;
    export function combineLatest<T, T2, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, project: (v1: T, v2: T2) => R, scheduler?: IScheduler): Observable<R>;
    export function combineLatest<T, T2, T3, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, project: (v1: T, v2: T2, v3: T3) => R, scheduler?: IScheduler): Observable<R>;
    export function combineLatest<T, T2, T3, T4, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, project: (v1: T, v2: T2, v3: T3, v4: T4) => R, scheduler?: IScheduler): Observable<R>;
    export function combineLatest<T, T2, T3, T4, T5, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => R, scheduler?: IScheduler): Observable<R>;
    export function combineLatest<T, T2, T3, T4, T5, T6, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => R, scheduler?: IScheduler): Observable<R>;
    export function combineLatest<T>(array: ObservableInput<T>[], scheduler?: IScheduler): Observable<T[]>;
    export function combineLatest<R>(array: ObservableInput<any>[], scheduler?: IScheduler): Observable<R>;
    export function combineLatest<T, R>(array: ObservableInput<T>[], project: (...values: Array<T>) => R, scheduler?: IScheduler): Observable<R>;
    export function combineLatest<R>(array: ObservableInput<any>[], project: (...values: Array<any>) => R, scheduler?: IScheduler): Observable<R>;
    export function combineLatest<T>(...observables: Array<ObservableInput<T> | IScheduler>): Observable<T[]>;
    export function combineLatest<T, R>(...observables: Array<ObservableInput<T> | ((...values: Array<T>) => R) | IScheduler>): Observable<R>;
    export function combineLatest<R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R) | IScheduler>): Observable<R>;
}
declare module "rxjs/add/observable/combineLatest" {
    import { combineLatest as combineLatestStatic } from "rxjs/observable/combineLatest";
    module "Observable" {
        namespace Observable {
            let combineLatest: typeof combineLatestStatic;
        }
    }
}
declare module "rxjs/operator/mergeAll" {
    import { Observable } from "rxjs/Observable";
    import { Operator } from "rxjs/Operator";
    import { Observer } from "rxjs/Observer";
    import { Subscription } from "rxjs/Subscription";
    import { OuterSubscriber } from "rxjs/OuterSubscriber";
    import { Subscribable } from "rxjs/Observable";
    export function mergeAll<T>(this: Observable<T>, concurrent?: number): T;
    export function mergeAll<T, R>(this: Observable<T>, concurrent?: number): Subscribable<R>;
    export class MergeAllOperator<T> implements Operator<Observable<T>, T> {
        private concurrent;
        constructor(concurrent: number);
        call(observer: Observer<T>, source: any): any;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class MergeAllSubscriber<T> extends OuterSubscriber<Observable<T>, T> {
        private concurrent;
        private hasCompleted;
        private buffer;
        private active;
        constructor(destination: Observer<T>, concurrent: number);
        protected _next(observable: Observable<T>): void;
        protected _complete(): void;
        notifyComplete(innerSub: Subscription): void;
    }
}
declare module "rxjs/operator/concat" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    import { IScheduler } from "rxjs/Scheduler";
    export function concat<T>(this: Observable<T>, scheduler?: IScheduler): Observable<T>;
    export function concat<T, T2>(this: Observable<T>, v2: ObservableInput<T2>, scheduler?: IScheduler): Observable<T | T2>;
    export function concat<T, T2, T3>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, scheduler?: IScheduler): Observable<T | T2 | T3>;
    export function concat<T, T2, T3, T4>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4>;
    export function concat<T, T2, T3, T4, T5>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5>;
    export function concat<T, T2, T3, T4, T5, T6>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5 | T6>;
    export function concat<T>(this: Observable<T>, ...observables: Array<ObservableInput<T> | IScheduler>): Observable<T>;
    export function concat<T, R>(this: Observable<T>, ...observables: Array<ObservableInput<any> | IScheduler>): Observable<R>;
    export function concatStatic<T>(v1: ObservableInput<T>, scheduler?: IScheduler): Observable<T>;
    export function concatStatic<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>, scheduler?: IScheduler): Observable<T | T2>;
    export function concatStatic<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, scheduler?: IScheduler): Observable<T | T2 | T3>;
    export function concatStatic<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4>;
    export function concatStatic<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5>;
    export function concatStatic<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5 | T6>;
    export function concatStatic<T>(...observables: (ObservableInput<T> | IScheduler)[]): Observable<T>;
    export function concatStatic<T, R>(...observables: (ObservableInput<any> | IScheduler)[]): Observable<R>;
}
declare module "rxjs/observable/concat" {
    import { concatStatic } from "rxjs/operator/concat";
    export const concat: typeof concatStatic;
}
declare module "rxjs/add/observable/concat" {
    import { concat as concatStatic } from "rxjs/observable/concat";
    module "Observable" {
        namespace Observable {
            let concat: typeof concatStatic;
        }
    }
}
declare module "rxjs/observable/DeferObservable" {
    import { Observable, SubscribableOrPromise } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class DeferObservable<T> extends Observable<T> {
        private observableFactory;
        /**
         * Creates an Observable that, on subscribe, calls an Observable factory to
         * make an Observable for each new Observer.
         *
         * <span class="informal">Creates the Observable lazily, that is, only when it
         * is subscribed.
         * </span>
         *
         * <img src="./img/defer.png" width="100%">
         *
         * `defer` allows you to create the Observable only when the Observer
         * subscribes, and create a fresh Observable for each Observer. It waits until
         * an Observer subscribes to it, and then it generates an Observable,
         * typically with an Observable factory function. It does this afresh for each
         * subscriber, so although each subscriber may think it is subscribing to the
         * same Observable, in fact each subscriber gets its own individual
         * Observable.
         *
         * @example <caption>Subscribe to either an Observable of clicks or an Observable of interval, at random</caption>
         * var clicksOrInterval = Rx.Observable.defer(function () {
         *   if (Math.random() > 0.5) {
         *     return Rx.Observable.fromEvent(document, 'click');
         *   } else {
         *     return Rx.Observable.interval(1000);
         *   }
         * });
         * clicksOrInterval.subscribe(x => console.log(x));
         *
         * // Results in the following behavior:
         * // If the result of Math.random() is greater than 0.5 it will listen
         * // for clicks anywhere on the "document"; when document is clicked it
         * // will log a MouseEvent object to the console. If the result is less
         * // than 0.5 it will emit ascending numbers, one every second(1000ms).
         *
         * @see {@link create}
         *
         * @param {function(): SubscribableOrPromise} observableFactory The Observable
         * factory function to invoke for each Observer that subscribes to the output
         * Observable. May also return a Promise, which will be converted on the fly
         * to an Observable.
         * @return {Observable} An Observable whose Observers' subscriptions trigger
         * an invocation of the given Observable factory function.
         * @static true
         * @name defer
         * @owner Observable
         */
        static create<T>(observableFactory: () => SubscribableOrPromise<T> | void): Observable<T>;
        constructor(observableFactory: () => SubscribableOrPromise<T> | void);
        protected _subscribe(subscriber: Subscriber<T>): Subscription;
    }
}
declare module "rxjs/observable/defer" {
    import { DeferObservable } from "rxjs/observable/DeferObservable";
    export const defer: typeof DeferObservable.create;
}
declare module "rxjs/add/observable/defer" {
    import { defer as staticDefer } from "rxjs/observable/defer";
    module "Observable" {
        namespace Observable {
            let defer: typeof staticDefer;
        }
    }
}
declare module "rxjs/observable/empty" {
    import { EmptyObservable } from "rxjs/observable/EmptyObservable";
    export const empty: typeof EmptyObservable.create;
}
declare module "rxjs/add/observable/empty" {
    import { empty as staticEmpty } from "rxjs/observable/empty";
    module "Observable" {
        namespace Observable {
            let empty: typeof staticEmpty;
        }
    }
}
declare module "rxjs/observable/ForkJoinObservable" {
    import { Observable, SubscribableOrPromise } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class ForkJoinObservable<T> extends Observable<T> {
        private sources;
        private resultSelector;
        constructor(sources: Array<SubscribableOrPromise<any>>, resultSelector?: (...values: Array<any>) => T);
        static create<T, T2>(v1: SubscribableOrPromise<T>, v2: SubscribableOrPromise<T2>): Observable<[T, T2]>;
        static create<T, T2, T3>(v1: SubscribableOrPromise<T>, v2: SubscribableOrPromise<T2>, v3: SubscribableOrPromise<T3>): Observable<[T, T2, T3]>;
        static create<T, T2, T3, T4>(v1: SubscribableOrPromise<T>, v2: SubscribableOrPromise<T2>, v3: SubscribableOrPromise<T3>, v4: SubscribableOrPromise<T4>): Observable<[T, T2, T3, T4]>;
        static create<T, T2, T3, T4, T5>(v1: SubscribableOrPromise<T>, v2: SubscribableOrPromise<T2>, v3: SubscribableOrPromise<T3>, v4: SubscribableOrPromise<T4>, v5: SubscribableOrPromise<T5>): Observable<[T, T2, T3, T4, T5]>;
        static create<T, T2, T3, T4, T5, T6>(v1: SubscribableOrPromise<T>, v2: SubscribableOrPromise<T2>, v3: SubscribableOrPromise<T3>, v4: SubscribableOrPromise<T4>, v5: SubscribableOrPromise<T5>, v6: SubscribableOrPromise<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
        static create<T, R>(v1: SubscribableOrPromise<T>, project: (v1: T) => R): Observable<R>;
        static create<T, T2, R>(v1: SubscribableOrPromise<T>, v2: SubscribableOrPromise<T2>, project: (v1: T, v2: T2) => R): Observable<R>;
        static create<T, T2, T3, R>(v1: SubscribableOrPromise<T>, v2: SubscribableOrPromise<T2>, v3: SubscribableOrPromise<T3>, project: (v1: T, v2: T2, v3: T3) => R): Observable<R>;
        static create<T, T2, T3, T4, R>(v1: SubscribableOrPromise<T>, v2: SubscribableOrPromise<T2>, v3: SubscribableOrPromise<T3>, v4: SubscribableOrPromise<T4>, project: (v1: T, v2: T2, v3: T3, v4: T4) => R): Observable<R>;
        static create<T, T2, T3, T4, T5, R>(v1: SubscribableOrPromise<T>, v2: SubscribableOrPromise<T2>, v3: SubscribableOrPromise<T3>, v4: SubscribableOrPromise<T4>, v5: SubscribableOrPromise<T5>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => R): Observable<R>;
        static create<T, T2, T3, T4, T5, T6, R>(v1: SubscribableOrPromise<T>, v2: SubscribableOrPromise<T2>, v3: SubscribableOrPromise<T3>, v4: SubscribableOrPromise<T4>, v5: SubscribableOrPromise<T5>, v6: SubscribableOrPromise<T6>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => R): Observable<R>;
        static create<T>(sources: SubscribableOrPromise<T>[]): Observable<T[]>;
        static create<R>(sources: SubscribableOrPromise<any>[]): Observable<R>;
        static create<T, R>(sources: SubscribableOrPromise<T>[], project: (...values: Array<T>) => R): Observable<R>;
        static create<R>(sources: SubscribableOrPromise<any>[], project: (...values: Array<any>) => R): Observable<R>;
        static create<T>(...sources: SubscribableOrPromise<T>[]): Observable<T[]>;
        static create<R>(...sources: SubscribableOrPromise<any>[]): Observable<R>;
        protected _subscribe(subscriber: Subscriber<any>): Subscription;
    }
}
declare module "rxjs/observable/forkJoin" {
    import { ForkJoinObservable } from "rxjs/observable/ForkJoinObservable";
    export const forkJoin: typeof ForkJoinObservable.create;
}
declare module "rxjs/add/observable/forkJoin" {
    import { forkJoin as staticForkJoin } from "rxjs/observable/forkJoin";
    module "Observable" {
        namespace Observable {
            let forkJoin: typeof staticForkJoin;
        }
    }
}
declare module "rxjs/observable/PromiseObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { TeardownLogic } from "rxjs/Subscription";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class PromiseObservable<T> extends Observable<T> {
        private promise;
        private scheduler;
        value: T;
        /**
         * Converts a Promise to an Observable.
         *
         * <span class="informal">Returns an Observable that just emits the Promise's
         * resolved value, then completes.</span>
         *
         * Converts an ES2015 Promise or a Promises/A+ spec compliant Promise to an
         * Observable. If the Promise resolves with a value, the output Observable
         * emits that resolved value as a `next`, and then completes. If the Promise
         * is rejected, then the output Observable emits the corresponding Error.
         *
         * @example <caption>Convert the Promise returned by Fetch to an Observable</caption>
         * var result = Rx.Observable.fromPromise(fetch('http://myserver.com/'));
         * result.subscribe(x => console.log(x), e => console.error(e));
         *
         * @see {@link bindCallback}
         * @see {@link from}
         *
         * @param {Promise<T>} promise The promise to be converted.
         * @param {Scheduler} [scheduler] An optional IScheduler to use for scheduling
         * the delivery of the resolved value (or the rejection).
         * @return {Observable<T>} An Observable which wraps the Promise.
         * @static true
         * @name fromPromise
         * @owner Observable
         */
        static create<T>(promise: Promise<T>, scheduler?: IScheduler): Observable<T>;
        constructor(promise: Promise<T>, scheduler?: IScheduler);
        protected _subscribe(subscriber: Subscriber<T>): TeardownLogic;
    }
}
declare module "rxjs/observable/IteratorObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    import { TeardownLogic } from "rxjs/Subscription";
    import { Subscriber } from "rxjs/Subscriber";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class IteratorObservable<T> extends Observable<T> {
        private scheduler;
        private iterator;
        static create<T>(iterator: any, scheduler?: IScheduler): IteratorObservable<T>;
        static dispatch(state: any): void;
        constructor(iterator: any, scheduler?: IScheduler);
        protected _subscribe(subscriber: Subscriber<T>): TeardownLogic;
    }
}
declare module "rxjs/observable/ArrayLikeObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { TeardownLogic } from "rxjs/Subscription";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class ArrayLikeObservable<T> extends Observable<T> {
        private arrayLike;
        private scheduler;
        static create<T>(arrayLike: ArrayLike<T>, scheduler?: IScheduler): Observable<T>;
        static dispatch(state: any): void;
        private value;
        constructor(arrayLike: ArrayLike<T>, scheduler?: IScheduler);
        protected _subscribe(subscriber: Subscriber<T>): TeardownLogic;
    }
}
declare module "rxjs/Notification" {
    import { PartialObserver } from "rxjs/Observer";
    import { Observable } from "rxjs/Observable";
    /**
     * Represents a push-based event or value that an {@link Observable} can emit.
     * This class is particularly useful for operators that manage notifications,
     * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
     * others. Besides wrapping the actual delivered value, it also annotates it
     * with metadata of, for instance, what type of push message it is (`next`,
     * `error`, or `complete`).
     *
     * @see {@link materialize}
     * @see {@link dematerialize}
     * @see {@link observeOn}
     *
     * @class Notification<T>
     */
    export class Notification<T> {
        kind: string;
        value: T;
        error: any;
        hasValue: boolean;
        constructor(kind: string, value?: T, error?: any);
        /**
         * Delivers to the given `observer` the value wrapped by this Notification.
         * @param {Observer} observer
         * @return
         */
        observe(observer: PartialObserver<T>): any;
        /**
         * Given some {@link Observer} callbacks, deliver the value represented by the
         * current Notification to the correctly corresponding callback.
         * @param {function(value: T): void} next An Observer `next` callback.
         * @param {function(err: any): void} [error] An Observer `error` callback.
         * @param {function(): void} [complete] An Observer `complete` callback.
         * @return {any}
         */
        do(next: (value: T) => void, error?: (err: any) => void, complete?: () => void): any;
        /**
         * Takes an Observer or its individual callback functions, and calls `observe`
         * or `do` methods accordingly.
         * @param {Observer|function(value: T): void} nextOrObserver An Observer or
         * the `next` callback.
         * @param {function(err: any): void} [error] An Observer `error` callback.
         * @param {function(): void} [complete] An Observer `complete` callback.
         * @return {any}
         */
        accept(nextOrObserver: PartialObserver<T> | ((value: T) => void), error?: (err: any) => void, complete?: () => void): any;
        /**
         * Returns a simple Observable that just delivers the notification represented
         * by this Notification instance.
         * @return {any}
         */
        toObservable(): Observable<T>;
        private static completeNotification;
        private static undefinedValueNotification;
        /**
         * A shortcut to create a Notification instance of the type `next` from a
         * given value.
         * @param {T} value The `next` value.
         * @return {Notification<T>} The "next" Notification representing the
         * argument.
         */
        static createNext<T>(value: T): Notification<T>;
        /**
         * A shortcut to create a Notification instance of the type `error` from a
         * given error.
         * @param {any} [err] The `error` error.
         * @return {Notification<T>} The "error" Notification representing the
         * argument.
         */
        static createError<T>(err?: any): Notification<T>;
        /**
         * A shortcut to create a Notification instance of the type `complete`.
         * @return {Notification<any>} The valueless "complete" Notification.
         */
        static createComplete(): Notification<any>;
    }
}
declare module "rxjs/operator/observeOn" {
    import { Observable } from "rxjs/Observable";
    import { IScheduler } from "rxjs/Scheduler";
    import { Operator } from "rxjs/Operator";
    import { PartialObserver } from "rxjs/Observer";
    import { Subscriber } from "rxjs/Subscriber";
    import { Notification } from "rxjs/Notification";
    import { TeardownLogic } from "rxjs/Subscription";
    import { Action } from "rxjs/scheduler/Action";
    /**
     *
     * Re-emits all notifications from source Observable with specified scheduler.
     *
     * <span class="informal">Ensure a specific scheduler is used, from outside of an Observable.</span>
     *
     * `observeOn` is an operator that accepts a scheduler as a first parameter, which will be used to reschedule
     * notifications emitted by the source Observable. It might be useful, if you do not have control over
     * internal scheduler of a given Observable, but want to control when its values are emitted nevertheless.
     *
     * Returned Observable emits the same notifications (nexted values, complete and error events) as the source Observable,
     * but rescheduled with provided scheduler. Note that this doesn't mean that source Observables internal
     * scheduler will be replaced in any way. Original scheduler still will be used, but when the source Observable emits
     * notification, it will be immediately scheduled again - this time with scheduler passed to `observeOn`.
     * An anti-pattern would be calling `observeOn` on Observable that emits lots of values synchronously, to split
     * that emissions into asynchronous chunks. For this to happen, scheduler would have to be passed into the source
     * Observable directly (usually into the operator that creates it). `observeOn` simply delays notifications a
     * little bit more, to ensure that they are emitted at expected moments.
     *
     * As a matter of fact, `observeOn` accepts second parameter, which specifies in milliseconds with what delay notifications
     * will be emitted. The main difference between {@link delay} operator and `observeOn` is that `observeOn`
     * will delay all notifications - including error notifications - while `delay` will pass through error
     * from source Observable immediately when it is emitted. In general it is highly recommended to use `delay` operator
     * for any kind of delaying of values in the stream, while using `observeOn` to specify which scheduler should be used
     * for notification emissions in general.
     *
     * @example <caption>Ensure values in subscribe are called just before browser repaint.</caption>
     * const intervals = Rx.Observable.interval(10); // Intervals are scheduled
     *                                               // with async scheduler by default...
     *
     * intervals
     * .observeOn(Rx.Scheduler.animationFrame)       // ...but we will observe on animationFrame
     * .subscribe(val => {                           // scheduler to ensure smooth animation.
     *   someDiv.style.height = val + 'px';
     * });
     *
     * @see {@link delay}
     *
     * @param {IScheduler} scheduler Scheduler that will be used to reschedule notifications from source Observable.
     * @param {number} [delay] Number of milliseconds that states with what delay every notification should be rescheduled.
     * @return {Observable<T>} Observable that emits the same notifications as the source Observable,
     * but with provided scheduler.
     *
     * @method observeOn
     * @owner Observable
     */
    export function observeOn<T>(this: Observable<T>, scheduler: IScheduler, delay?: number): Observable<T>;
    export class ObserveOnOperator<T> implements Operator<T, T> {
        private scheduler;
        private delay;
        constructor(scheduler: IScheduler, delay?: number);
        call(subscriber: Subscriber<T>, source: any): TeardownLogic;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class ObserveOnSubscriber<T> extends Subscriber<T> {
        private scheduler;
        private delay;
        static dispatch(this: Action<ObserveOnMessage>, arg: ObserveOnMessage): void;
        constructor(destination: Subscriber<T>, scheduler: IScheduler, delay?: number);
        private scheduleMessage(notification);
        protected _next(value: T): void;
        protected _error(err: any): void;
        protected _complete(): void;
    }
    export class ObserveOnMessage {
        notification: Notification<any>;
        destination: PartialObserver<any>;
        constructor(notification: Notification<any>, destination: PartialObserver<any>);
    }
}
declare module "rxjs/observable/FromObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable, ObservableInput } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class FromObservable<T> extends Observable<T> {
        private ish;
        private scheduler;
        constructor(ish: ObservableInput<T>, scheduler?: IScheduler);
        static create<T>(ish: ObservableInput<T>, scheduler?: IScheduler): Observable<T>;
        static create<T, R>(ish: ArrayLike<T>, scheduler?: IScheduler): Observable<R>;
        protected _subscribe(subscriber: Subscriber<T>): any;
    }
}
declare module "rxjs/observable/from" {
    import { FromObservable } from "rxjs/observable/FromObservable";
    export const from: typeof FromObservable.create;
}
declare module "rxjs/add/observable/from" {
    import { from as staticFrom } from "rxjs/observable/from";
    module "Observable" {
        namespace Observable {
            let from: typeof staticFrom;
        }
    }
}
declare module "rxjs/observable/FromEventObservable" {
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    export type NodeStyleEventEmitter = {
        addListener: (eventName: string, handler: Function) => void;
        removeListener: (eventName: string, handler: Function) => void;
    };
    export type JQueryStyleEventEmitter = {
        on: (eventName: string, handler: Function) => void;
        off: (eventName: string, handler: Function) => void;
    };
    export type EventTargetLike = EventTarget | NodeStyleEventEmitter | JQueryStyleEventEmitter | NodeList | HTMLCollection;
    export type EventListenerOptions = {
        capture?: boolean;
        passive?: boolean;
        once?: boolean;
    } | boolean;
    export type SelectorMethodSignature<T> = (...args: Array<any>) => T;
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class FromEventObservable<T> extends Observable<T> {
        private sourceObj;
        private eventName;
        private selector;
        private options;
        static create<T>(target: EventTargetLike, eventName: string): Observable<T>;
        static create<T>(target: EventTargetLike, eventName: string, selector: SelectorMethodSignature<T>): Observable<T>;
        static create<T>(target: EventTargetLike, eventName: string, options: EventListenerOptions): Observable<T>;
        static create<T>(target: EventTargetLike, eventName: string, options: EventListenerOptions, selector: SelectorMethodSignature<T>): Observable<T>;
        constructor(sourceObj: EventTargetLike, eventName: string, selector?: SelectorMethodSignature<T>, options?: EventListenerOptions);
        private static setupSubscription<T>(sourceObj, eventName, handler, subscriber, options?);
        protected _subscribe(subscriber: Subscriber<T>): void;
    }
}
declare module "rxjs/observable/fromEvent" {
    import { FromEventObservable } from "rxjs/observable/FromEventObservable";
    export const fromEvent: typeof FromEventObservable.create;
}
declare module "rxjs/add/observable/fromEvent" {
    import { fromEvent as staticFromEvent } from "rxjs/observable/fromEvent";
    module "Observable" {
        namespace Observable {
            let fromEvent: typeof staticFromEvent;
        }
    }
}
declare module "rxjs/observable/FromEventPatternObservable" {
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class FromEventPatternObservable<T> extends Observable<T> {
        private addHandler;
        private removeHandler;
        private selector;
        /**
         * Creates an Observable from an API based on addHandler/removeHandler
         * functions.
         *
         * <span class="informal">Converts any addHandler/removeHandler API to an
         * Observable.</span>
         *
         * <img src="./img/fromEventPattern.png" width="100%">
         *
         * Creates an Observable by using the `addHandler` and `removeHandler`
         * functions to add and remove the handlers, with an optional selector
         * function to project the event arguments to a result. The `addHandler` is
         * called when the output Observable is subscribed, and `removeHandler` is
         * called when the Subscription is unsubscribed.
         *
         * @example <caption>Emits clicks happening on the DOM document</caption>
         * function addClickHandler(handler) {
         *   document.addEventListener('click', handler);
         * }
         *
         * function removeClickHandler(handler) {
         *   document.removeEventListener('click', handler);
         * }
         *
         * var clicks = Rx.Observable.fromEventPattern(
         *   addClickHandler,
         *   removeClickHandler
         * );
         * clicks.subscribe(x => console.log(x));
         *
         * @see {@link from}
         * @see {@link fromEvent}
         *
         * @param {function(handler: Function): any} addHandler A function that takes
         * a `handler` function as argument and attaches it somehow to the actual
         * source of events.
         * @param {function(handler: Function, signal?: any): void} [removeHandler] An optional function that
         * takes a `handler` function as argument and removes it in case it was
         * previously attached using `addHandler`. if addHandler returns signal to teardown when remove,
         * removeHandler function will forward it.
         * @param {function(...args: any): T} [selector] An optional function to
         * post-process results. It takes the arguments from the event handler and
         * should return a single value.
         * @return {Observable<T>}
         * @static true
         * @name fromEventPattern
         * @owner Observable
         */
        static create<T>(addHandler: (handler: Function) => any, removeHandler?: (handler: Function, signal?: any) => void, selector?: (...args: Array<any>) => T): FromEventPatternObservable<T>;
        constructor(addHandler: (handler: Function) => any, removeHandler?: (handler: Function, signal?: any) => void, selector?: (...args: Array<any>) => T);
        protected _subscribe(subscriber: Subscriber<T>): void;
        private _callSelector(subscriber, args);
        private _callAddHandler(handler, errorSubscriber);
    }
}
declare module "rxjs/observable/fromEventPattern" {
    import { FromEventPatternObservable } from "rxjs/observable/FromEventPatternObservable";
    export const fromEventPattern: typeof FromEventPatternObservable.create;
}
declare module "rxjs/add/observable/fromEventPattern" {
    import { fromEventPattern as staticFromEventPattern } from "rxjs/observable/fromEventPattern";
    module "Observable" {
        namespace Observable {
            let fromEventPattern: typeof staticFromEventPattern;
        }
    }
}
declare module "rxjs/observable/fromPromise" {
    import { PromiseObservable } from "rxjs/observable/PromiseObservable";
    export const fromPromise: typeof PromiseObservable.create;
}
declare module "rxjs/add/observable/fromPromise" {
    import { fromPromise as staticFromPromise } from "rxjs/observable/fromPromise";
    module "Observable" {
        namespace Observable {
            let fromPromise: typeof staticFromPromise;
        }
    }
}
declare module "rxjs/observable/GenerateObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    export type ConditionFunc<S> = (state: S) => boolean;
    export type IterateFunc<S> = (state: S) => S;
    export type ResultFunc<S, T> = (state: S) => T;
    export interface GenerateBaseOptions<S> {
        /**
         * Initial state.
        */
        initialState: S;
        /**
         * Condition function that accepts state and returns boolean.
         * When it returns false, the generator stops.
         * If not specified, a generator never stops.
        */
        condition?: ConditionFunc<S>;
        /**
         * Iterate function that accepts state and returns new state.
         */
        iterate: IterateFunc<S>;
        /**
         * IScheduler to use for generation process.
         * By default, a generator starts immediately.
        */
        scheduler?: IScheduler;
    }
    export interface GenerateOptions<T, S> extends GenerateBaseOptions<S> {
        /**
         * Result selection function that accepts state and returns a value to emit.
         */
        resultSelector: ResultFunc<S, T>;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class GenerateObservable<T, S> extends Observable<T> {
        private initialState;
        private condition;
        private iterate;
        private resultSelector;
        private scheduler;
        constructor(initialState: S, condition: ConditionFunc<S>, iterate: IterateFunc<S>, resultSelector: ResultFunc<S, T>, scheduler?: IScheduler);
        /**
         * Generates an observable sequence by running a state-driven loop
         * producing the sequence's elements, using the specified scheduler
         * to send out observer messages.
         *
         * <img src="./img/generate.png" width="100%">
         *
         * @example <caption>Produces sequence of 0, 1, 2, ... 9, then completes.</caption>
         * var res = Rx.Observable.generate(0, x => x < 10, x => x + 1, x => x);
         *
         * @example <caption>Using asap scheduler, produces sequence of 2, 3, 5, then completes.</caption>
         * var res = Rx.Observable.generate(1, x => x < 5, x => x * 2, x => x + 1, Rx.Scheduler.asap);
         *
         * @see {@link from}
         * @see {@link create}
         *
         * @param {S} initialState Initial state.
         * @param {function (state: S): boolean} condition Condition to terminate generation (upon returning false).
         * @param {function (state: S): S} iterate Iteration step function.
         * @param {function (state: S): T} resultSelector Selector function for results produced in the sequence.
         * @param {Scheduler} [scheduler] A {@link IScheduler} on which to run the generator loop. If not provided, defaults to emit immediately.
         * @returns {Observable<T>} The generated sequence.
         */
        static create<T, S>(initialState: S, condition: ConditionFunc<S>, iterate: IterateFunc<S>, resultSelector: ResultFunc<S, T>, scheduler?: IScheduler): Observable<T>;
        /**
         * Generates an observable sequence by running a state-driven loop
         * producing the sequence's elements, using the specified scheduler
         * to send out observer messages.
         * The overload uses state as an emitted value.
         *
         * <img src="./img/generate.png" width="100%">
         *
         * @example <caption>Produces sequence of 0, 1, 2, ... 9, then completes.</caption>
         * var res = Rx.Observable.generate(0, x => x < 10, x => x + 1);
         *
         * @example <caption>Using asap scheduler, produces sequence of 1, 2, 4, then completes.</caption>
         * var res = Rx.Observable.generate(1, x => x < 5, x => x * 2, Rx.Scheduler.asap);
         *
         * @see {@link from}
         * @see {@link create}
         *
         * @param {S} initialState Initial state.
         * @param {function (state: S): boolean} condition Condition to terminate generation (upon returning false).
         * @param {function (state: S): S} iterate Iteration step function.
         * @param {Scheduler} [scheduler] A {@link IScheduler} on which to run the generator loop. If not provided, defaults to emit immediately.
         * @returns {Observable<S>} The generated sequence.
         */
        static create<S>(initialState: S, condition: ConditionFunc<S>, iterate: IterateFunc<S>, scheduler?: IScheduler): Observable<S>;
        /**
         * Generates an observable sequence by running a state-driven loop
         * producing the sequence's elements, using the specified scheduler
         * to send out observer messages.
         * The overload accepts options object that might contain initial state, iterate,
         * condition and scheduler.
         *
         * <img src="./img/generate.png" width="100%">
         *
         * @example <caption>Produces sequence of 0, 1, 2, ... 9, then completes.</caption>
         * var res = Rx.Observable.generate({
         *   initialState: 0,
         *   condition: x => x < 10,
         *   iterate: x => x + 1
         * });
         *
         * @see {@link from}
         * @see {@link create}
         *
         * @param {GenerateBaseOptions<S>} options Object that must contain initialState, iterate and might contain condition and scheduler.
         * @returns {Observable<S>} The generated sequence.
         */
        static create<S>(options: GenerateBaseOptions<S>): Observable<S>;
        /**
         * Generates an observable sequence by running a state-driven loop
         * producing the sequence's elements, using the specified scheduler
         * to send out observer messages.
         * The overload accepts options object that might contain initial state, iterate,
         * condition, result selector and scheduler.
         *
         * <img src="./img/generate.png" width="100%">
         *
         * @example <caption>Produces sequence of 0, 1, 2, ... 9, then completes.</caption>
         * var res = Rx.Observable.generate({
         *   initialState: 0,
         *   condition: x => x < 10,
         *   iterate: x => x + 1,
         *   resultSelector: x => x
         * });
         *
         * @see {@link from}
         * @see {@link create}
         *
         * @param {GenerateOptions<T, S>} options Object that must contain initialState, iterate, resultSelector and might contain condition and scheduler.
         * @returns {Observable<T>} The generated sequence.
         */
        static create<T, S>(options: GenerateOptions<T, S>): Observable<T>;
        protected _subscribe(subscriber: Subscriber<any>): Subscription | Function | void;
        private static dispatch<T, S>(state);
    }
}
declare module "rxjs/add/observable/generate" {
    import { GenerateObservable } from "rxjs/observable/GenerateObservable";
    module "Observable" {
        namespace Observable {
            let generate: typeof GenerateObservable.create;
        }
    }
}
declare module "rxjs/observable/if" {
    import { IfObservable } from "rxjs/observable/IfObservable";
    export const _if: typeof IfObservable.create;
}
declare module "rxjs/add/observable/if" {
}
declare module "rxjs/util/isNumeric" {
    export function isNumeric(val: any): val is number;
}
declare module "rxjs/scheduler/AsyncScheduler" {
    import { Scheduler } from "rxjs/Scheduler";
    import { AsyncAction } from "rxjs/scheduler/AsyncAction";
    export class AsyncScheduler extends Scheduler {
        actions: Array<AsyncAction<any>>;
        /**
         * A flag to indicate whether the Scheduler is currently executing a batch of
         * queued actions.
         * @type {boolean}
         */
        active: boolean;
        /**
         * An internal ID used to track the latest asynchronous task such as those
         * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
         * others.
         * @type {any}
         */
        scheduled: any;
        flush(action: AsyncAction<any>): void;
    }
}
declare module "rxjs/scheduler/AsyncAction" {
    import { Action } from "rxjs/scheduler/Action";
    import { Subscription } from "rxjs/Subscription";
    import { AsyncScheduler } from "rxjs/scheduler/AsyncScheduler";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class AsyncAction<T> extends Action<T> {
        protected scheduler: AsyncScheduler;
        protected work: (this: AsyncAction<T>, state?: T) => void;
        id: any;
        state: T;
        delay: number;
        protected pending: boolean;
        constructor(scheduler: AsyncScheduler, work: (this: AsyncAction<T>, state?: T) => void);
        schedule(state?: T, delay?: number): Subscription;
        protected requestAsyncId(scheduler: AsyncScheduler, id?: any, delay?: number): any;
        protected recycleAsyncId(scheduler: AsyncScheduler, id: any, delay?: number): any;
        /**
         * Immediately executes this action and the `work` it contains.
         * @return {any}
         */
        execute(state: T, delay: number): any;
        protected _execute(state: T, delay: number): any;
        protected _unsubscribe(): void;
    }
}
declare module "rxjs/scheduler/async" {
    import { AsyncScheduler } from "rxjs/scheduler/AsyncScheduler";
    /**
     *
     * Async Scheduler
     *
     * <span class="informal">Schedule task as if you used setTimeout(task, duration)</span>
     *
     * `async` scheduler schedules tasks asynchronously, by putting them on the JavaScript
     * event loop queue. It is best used to delay tasks in time or to schedule tasks repeating
     * in intervals.
     *
     * If you just want to "defer" task, that is to perform it right after currently
     * executing synchronous code ends (commonly achieved by `setTimeout(deferredTask, 0)`),
     * better choice will be the {@link asap} scheduler.
     *
     * @example <caption>Use async scheduler to delay task</caption>
     * const task = () => console.log('it works!');
     *
     * Rx.Scheduler.async.schedule(task, 2000);
     *
     * // After 2 seconds logs:
     * // "it works!"
     *
     *
     * @example <caption>Use async scheduler to repeat task in intervals</caption>
     * function task(state) {
     *   console.log(state);
     *   this.schedule(state + 1, 1000); // `this` references currently executing Action,
     *                                   // which we reschedule with new state and delay
     * }
     *
     * Rx.Scheduler.async.schedule(task, 3000, 0);
     *
     * // Logs:
     * // 0 after 3s
     * // 1 after 4s
     * // 2 after 5s
     * // 3 after 6s
     *
     * @static true
     * @name async
     * @owner Scheduler
     */
    export const async: AsyncScheduler;
}
declare module "rxjs/observable/IntervalObservable" {
    import { Subscriber } from "rxjs/Subscriber";
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class IntervalObservable extends Observable<number> {
        private period;
        private scheduler;
        /**
         * Creates an Observable that emits sequential numbers every specified
         * interval of time, on a specified IScheduler.
         *
         * <span class="informal">Emits incremental numbers periodically in time.
         * </span>
         *
         * <img src="./img/interval.png" width="100%">
         *
         * `interval` returns an Observable that emits an infinite sequence of
         * ascending integers, with a constant interval of time of your choosing
         * between those emissions. The first emission is not sent immediately, but
         * only after the first period has passed. By default, this operator uses the
         * `async` IScheduler to provide a notion of time, but you may pass any
         * IScheduler to it.
         *
         * @example <caption>Emits ascending numbers, one every second (1000ms)</caption>
         * var numbers = Rx.Observable.interval(1000);
         * numbers.subscribe(x => console.log(x));
         *
         * @see {@link timer}
         * @see {@link delay}
         *
         * @param {number} [period=0] The interval size in milliseconds (by default)
         * or the time unit determined by the scheduler's clock.
         * @param {Scheduler} [scheduler=async] The IScheduler to use for scheduling
         * the emission of values, and providing a notion of "time".
         * @return {Observable} An Observable that emits a sequential number each time
         * interval.
         * @static true
         * @name interval
         * @owner Observable
         */
        static create(period?: number, scheduler?: IScheduler): Observable<number>;
        static dispatch(state: any): void;
        constructor(period?: number, scheduler?: IScheduler);
        protected _subscribe(subscriber: Subscriber<number>): void;
    }
}
declare module "rxjs/observable/interval" {
    import { IntervalObservable } from "rxjs/observable/IntervalObservable";
    export const interval: typeof IntervalObservable.create;
}
declare module "rxjs/add/observable/interval" {
    import { interval as staticInterval } from "rxjs/observable/interval";
    module "Observable" {
        namespace Observable {
            let interval: typeof staticInterval;
        }
    }
}
declare module "rxjs/operator/merge" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    import { IScheduler } from "rxjs/Scheduler";
    export function merge<T>(this: Observable<T>, scheduler?: IScheduler): Observable<T>;
    export function merge<T>(this: Observable<T>, concurrent?: number, scheduler?: IScheduler): Observable<T>;
    export function merge<T, T2>(this: Observable<T>, v2: ObservableInput<T2>, scheduler?: IScheduler): Observable<T | T2>;
    export function merge<T, T2>(this: Observable<T>, v2: ObservableInput<T2>, concurrent?: number, scheduler?: IScheduler): Observable<T | T2>;
    export function merge<T, T2, T3>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, scheduler?: IScheduler): Observable<T | T2 | T3>;
    export function merge<T, T2, T3>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, concurrent?: number, scheduler?: IScheduler): Observable<T | T2 | T3>;
    export function merge<T, T2, T3, T4>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4>;
    export function merge<T, T2, T3, T4>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, concurrent?: number, scheduler?: IScheduler): Observable<T | T2 | T3 | T4>;
    export function merge<T, T2, T3, T4, T5>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5>;
    export function merge<T, T2, T3, T4, T5>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, concurrent?: number, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5>;
    export function merge<T, T2, T3, T4, T5, T6>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5 | T6>;
    export function merge<T, T2, T3, T4, T5, T6>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, concurrent?: number, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5 | T6>;
    export function merge<T>(this: Observable<T>, ...observables: Array<ObservableInput<T> | IScheduler | number>): Observable<T>;
    export function merge<T, R>(this: Observable<T>, ...observables: Array<ObservableInput<any> | IScheduler | number>): Observable<R>;
    export function mergeStatic<T>(v1: ObservableInput<T>, scheduler?: IScheduler): Observable<T>;
    export function mergeStatic<T>(v1: ObservableInput<T>, concurrent?: number, scheduler?: IScheduler): Observable<T>;
    export function mergeStatic<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>, scheduler?: IScheduler): Observable<T | T2>;
    export function mergeStatic<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>, concurrent?: number, scheduler?: IScheduler): Observable<T | T2>;
    export function mergeStatic<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, scheduler?: IScheduler): Observable<T | T2 | T3>;
    export function mergeStatic<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, concurrent?: number, scheduler?: IScheduler): Observable<T | T2 | T3>;
    export function mergeStatic<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4>;
    export function mergeStatic<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, concurrent?: number, scheduler?: IScheduler): Observable<T | T2 | T3 | T4>;
    export function mergeStatic<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5>;
    export function mergeStatic<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, concurrent?: number, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5>;
    export function mergeStatic<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5 | T6>;
    export function mergeStatic<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, concurrent?: number, scheduler?: IScheduler): Observable<T | T2 | T3 | T4 | T5 | T6>;
    export function mergeStatic<T>(...observables: (ObservableInput<T> | IScheduler | number)[]): Observable<T>;
    export function mergeStatic<T, R>(...observables: (ObservableInput<any> | IScheduler | number)[]): Observable<R>;
}
declare module "rxjs/observable/merge" {
    import { mergeStatic } from "rxjs/operator/merge";
    export const merge: typeof mergeStatic;
}
declare module "rxjs/add/observable/merge" {
    import { merge as mergeStatic } from "rxjs/observable/merge";
    module "Observable" {
        namespace Observable {
            let merge: typeof mergeStatic;
        }
    }
}
declare module "rxjs/operator/race" {
    import { Observable } from "rxjs/Observable";
    import { Operator } from "rxjs/Operator";
    import { Subscriber } from "rxjs/Subscriber";
    import { TeardownLogic } from "rxjs/Subscription";
    import { OuterSubscriber } from "rxjs/OuterSubscriber";
    import { InnerSubscriber } from "rxjs/InnerSubscriber";
    export function race<T>(this: Observable<T>, observables: Array<Observable<T>>): Observable<T>;
    export function race<T, R>(this: Observable<T>, observables: Array<Observable<T>>): Observable<R>;
    export function race<T>(this: Observable<T>, ...observables: Array<Observable<T> | Array<Observable<T>>>): Observable<T>;
    export function race<T, R>(this: Observable<T>, ...observables: Array<Observable<any> | Array<Observable<any>>>): Observable<R>;
    /**
     * Returns an Observable that mirrors the first source Observable to emit an item.
     * @param {...Observables} ...observables sources used to race for which Observable emits first.
     * @return {Observable} an Observable that mirrors the output of the first Observable to emit an item.
     * @static true
     * @name race
     * @owner Observable
     */
    export function raceStatic<T>(observables: Array<Observable<T>>): Observable<T>;
    export function raceStatic<T>(observables: Array<Observable<any>>): Observable<T>;
    export function raceStatic<T>(...observables: Array<Observable<T> | Array<Observable<T>>>): Observable<T>;
    export class RaceOperator<T> implements Operator<T, T> {
        call(subscriber: Subscriber<T>, source: any): TeardownLogic;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class RaceSubscriber<T> extends OuterSubscriber<T, T> {
        private hasFirst;
        private observables;
        private subscriptions;
        constructor(destination: Subscriber<T>);
        protected _next(observable: any): void;
        protected _complete(): void;
        notifyNext(outerValue: T, innerValue: T, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, T>): void;
    }
}
declare module "rxjs/add/observable/race" {
    import { raceStatic } from "rxjs/operator/race";
    module "Observable" {
        namespace Observable {
            let race: typeof raceStatic;
        }
    }
}
declare module "rxjs/util/noop" {
    export function noop(): void;
}
declare module "rxjs/observable/NeverObservable" {
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class NeverObservable<T> extends Observable<T> {
        /**
         * Creates an Observable that emits no items to the Observer.
         *
         * <span class="informal">An Observable that never emits anything.</span>
         *
         * <img src="./img/never.png" width="100%">
         *
         * This static operator is useful for creating a simple Observable that emits
         * neither values nor errors nor the completion notification. It can be used
         * for testing purposes or for composing with other Observables. Please not
         * that by never emitting a complete notification, this Observable keeps the
         * subscription from being disposed automatically. Subscriptions need to be
         * manually disposed.
         *
         * @example <caption>Emit the number 7, then never emit anything else (not even complete).</caption>
         * function info() {
         *   console.log('Will not be called');
         * }
         * var result = Rx.Observable.never().startWith(7);
         * result.subscribe(x => console.log(x), info, info);
         *
         * @see {@link create}
         * @see {@link empty}
         * @see {@link of}
         * @see {@link throw}
         *
         * @return {Observable} A "never" Observable: never emits anything.
         * @static true
         * @name never
         * @owner Observable
         */
        static create<T>(): NeverObservable<T>;
        constructor();
        protected _subscribe(subscriber: Subscriber<T>): void;
    }
}
declare module "rxjs/observable/never" {
    import { NeverObservable } from "rxjs/observable/NeverObservable";
    export const never: typeof NeverObservable.create;
}
declare module "rxjs/add/observable/never" {
    import { never as staticNever } from "rxjs/observable/never";
    module "Observable" {
        namespace Observable {
            let never: typeof staticNever;
        }
    }
}
declare module "rxjs/observable/of" {
    import { ArrayObservable } from "rxjs/observable/ArrayObservable";
    export const of: typeof ArrayObservable.of;
}
declare module "rxjs/add/observable/of" {
    import { of as staticOf } from "rxjs/observable/of";
    module "Observable" {
        namespace Observable {
            let of: typeof staticOf;
        }
    }
}
declare module "rxjs/operator/onErrorResumeNext" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    export function onErrorResumeNext<T, R>(this: Observable<T>, v: ObservableInput<R>): Observable<R>;
    export function onErrorResumeNext<T, T2, T3, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<R>;
    export function onErrorResumeNext<T, T2, T3, T4, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<R>;
    export function onErrorResumeNext<T, T2, T3, T4, T5, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<R>;
    export function onErrorResumeNext<T, T2, T3, T4, T5, T6, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<R>;
    export function onErrorResumeNext<T, R>(this: Observable<T>, ...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
    export function onErrorResumeNext<T, R>(this: Observable<T>, array: ObservableInput<any>[]): Observable<R>;
    export function onErrorResumeNextStatic<R>(v: ObservableInput<R>): Observable<R>;
    export function onErrorResumeNextStatic<T2, T3, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<R>;
    export function onErrorResumeNextStatic<T2, T3, T4, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<R>;
    export function onErrorResumeNextStatic<T2, T3, T4, T5, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<R>;
    export function onErrorResumeNextStatic<T2, T3, T4, T5, T6, R>(v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<R>;
    export function onErrorResumeNextStatic<R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
    export function onErrorResumeNextStatic<R>(array: ObservableInput<any>[]): Observable<R>;
}
declare module "rxjs/add/observable/onErrorResumeNext" {
    import { onErrorResumeNextStatic } from "rxjs/operator/onErrorResumeNext";
    module "Observable" {
        namespace Observable {
            let onErrorResumeNext: typeof onErrorResumeNextStatic;
        }
    }
}
declare module "rxjs/observable/PairsObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { TeardownLogic } from "rxjs/Subscription";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class PairsObservable<T> extends Observable<Array<string | T>> {
        private obj;
        private scheduler;
        private keys;
        /**
         * Convert an object into an observable sequence of [key, value] pairs
         * using an optional IScheduler to enumerate the object.
         *
         * @example <caption>Converts a javascript object to an Observable</caption>
         * var obj = {
         *   foo: 42,
         *   bar: 56,
         *   baz: 78
         * };
         *
         * var source = Rx.Observable.pairs(obj);
         *
         * var subscription = source.subscribe(
         *   function (x) {
         *     console.log('Next: %s', x);
         *   },
         *   function (err) {
         *     console.log('Error: %s', err);
         *   },
         *   function () {
         *     console.log('Completed');
         *   });
         *
         * @param {Object} obj The object to inspect and turn into an
         * Observable sequence.
         * @param {Scheduler} [scheduler] An optional IScheduler to run the
         * enumeration of the input sequence on.
         * @returns {(Observable<Array<string | T>>)} An observable sequence of
         * [key, value] pairs from the object.
         */
        static create<T>(obj: Object, scheduler?: IScheduler): Observable<Array<string | T>>;
        constructor(obj: Object, scheduler?: IScheduler);
        protected _subscribe(subscriber: Subscriber<Array<string | T>>): TeardownLogic;
    }
}
declare module "rxjs/observable/pairs" {
    import { PairsObservable } from "rxjs/observable/PairsObservable";
    export const pairs: typeof PairsObservable.create;
}
declare module "rxjs/add/observable/pairs" {
    import { pairs as staticPairs } from "rxjs/observable/pairs";
    module "Observable" {
        namespace Observable {
            let pairs: typeof staticPairs;
        }
    }
}
declare module "rxjs/observable/RangeObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    import { TeardownLogic } from "rxjs/Subscription";
    import { Subscriber } from "rxjs/Subscriber";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class RangeObservable extends Observable<number> {
        /**
         * Creates an Observable that emits a sequence of numbers within a specified
         * range.
         *
         * <span class="informal">Emits a sequence of numbers in a range.</span>
         *
         * <img src="./img/range.png" width="100%">
         *
         * `range` operator emits a range of sequential integers, in order, where you
         * select the `start` of the range and its `length`. By default, uses no
         * IScheduler and just delivers the notifications synchronously, but may use
         * an optional IScheduler to regulate those deliveries.
         *
         * @example <caption>Emits the numbers 1 to 10</caption>
         * var numbers = Rx.Observable.range(1, 10);
         * numbers.subscribe(x => console.log(x));
         *
         * @see {@link timer}
         * @see {@link interval}
         *
         * @param {number} [start=0] The value of the first integer in the sequence.
         * @param {number} [count=0] The number of sequential integers to generate.
         * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
         * the emissions of the notifications.
         * @return {Observable} An Observable of numbers that emits a finite range of
         * sequential integers.
         * @static true
         * @name range
         * @owner Observable
         */
        static create(start?: number, count?: number, scheduler?: IScheduler): Observable<number>;
        static dispatch(state: any): void;
        private start;
        private _count;
        private scheduler;
        constructor(start: number, count: number, scheduler?: IScheduler);
        protected _subscribe(subscriber: Subscriber<number>): TeardownLogic;
    }
}
declare module "rxjs/observable/range" {
    import { RangeObservable } from "rxjs/observable/RangeObservable";
    export const range: typeof RangeObservable.create;
}
declare module "rxjs/add/observable/range" {
    import { range as staticRange } from "rxjs/observable/range";
    module "Observable" {
        namespace Observable {
            let range: typeof staticRange;
        }
    }
}
declare module "rxjs/observable/UsingObservable" {
    import { Observable, SubscribableOrPromise } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { AnonymousSubscription, TeardownLogic } from "rxjs/Subscription";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class UsingObservable<T> extends Observable<T> {
        private resourceFactory;
        private observableFactory;
        static create<T>(resourceFactory: () => AnonymousSubscription | void, observableFactory: (resource: AnonymousSubscription) => SubscribableOrPromise<T> | void): Observable<T>;
        constructor(resourceFactory: () => AnonymousSubscription | void, observableFactory: (resource: AnonymousSubscription) => SubscribableOrPromise<T> | void);
        protected _subscribe(subscriber: Subscriber<T>): TeardownLogic;
    }
}
declare module "rxjs/observable/using" {
    import { UsingObservable } from "rxjs/observable/UsingObservable";
    export const using: typeof UsingObservable.create;
}
declare module "rxjs/add/observable/using" {
    import { using as staticUsing } from "rxjs/observable/using";
    module "Observable" {
        namespace Observable {
            let using: typeof staticUsing;
        }
    }
}
declare module "rxjs/observable/throw" {
    import { ErrorObservable } from "rxjs/observable/ErrorObservable";
    export const _throw: typeof ErrorObservable.create;
}
declare module "rxjs/add/observable/throw" {
}
declare module "rxjs/util/isDate" {
    export function isDate(value: any): value is Date;
}
declare module "rxjs/observable/TimerObservable" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    import { TeardownLogic } from "rxjs/Subscription";
    import { Subscriber } from "rxjs/Subscriber";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class TimerObservable extends Observable<number> {
        /**
         * Creates an Observable that starts emitting after an `initialDelay` and
         * emits ever increasing numbers after each `period` of time thereafter.
         *
         * <span class="informal">Its like {@link interval}, but you can specify when
         * should the emissions start.</span>
         *
         * <img src="./img/timer.png" width="100%">
         *
         * `timer` returns an Observable that emits an infinite sequence of ascending
         * integers, with a constant interval of time, `period` of your choosing
         * between those emissions. The first emission happens after the specified
         * `initialDelay`. The initial delay may be a {@link Date}. By default, this
         * operator uses the `async` IScheduler to provide a notion of time, but you
         * may pass any IScheduler to it. If `period` is not specified, the output
         * Observable emits only one value, `0`. Otherwise, it emits an infinite
         * sequence.
         *
         * @example <caption>Emits ascending numbers, one every second (1000ms), starting after 3 seconds</caption>
         * var numbers = Rx.Observable.timer(3000, 1000);
         * numbers.subscribe(x => console.log(x));
         *
         * @example <caption>Emits one number after five seconds</caption>
         * var numbers = Rx.Observable.timer(5000);
         * numbers.subscribe(x => console.log(x));
         *
         * @see {@link interval}
         * @see {@link delay}
         *
         * @param {number|Date} initialDelay The initial delay time to wait before
         * emitting the first value of `0`.
         * @param {number} [period] The period of time between emissions of the
         * subsequent numbers.
         * @param {Scheduler} [scheduler=async] The IScheduler to use for scheduling
         * the emission of values, and providing a notion of "time".
         * @return {Observable} An Observable that emits a `0` after the
         * `initialDelay` and ever increasing numbers after each `period` of time
         * thereafter.
         * @static true
         * @name timer
         * @owner Observable
         */
        static create(initialDelay?: number | Date, period?: number | IScheduler, scheduler?: IScheduler): Observable<number>;
        static dispatch(state: any): any;
        private period;
        private dueTime;
        private scheduler;
        constructor(dueTime?: number | Date, period?: number | IScheduler, scheduler?: IScheduler);
        protected _subscribe(subscriber: Subscriber<number>): TeardownLogic;
    }
}
declare module "rxjs/observable/timer" {
    import { TimerObservable } from "rxjs/observable/TimerObservable";
    export const timer: typeof TimerObservable.create;
}
declare module "rxjs/add/observable/timer" {
    import { timer as staticTimer } from "rxjs/observable/timer";
    module "Observable" {
        namespace Observable {
            let timer: typeof staticTimer;
        }
    }
}
declare module "rxjs/operator/zip" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    import { Operator } from "rxjs/Operator";
    import { Subscriber } from "rxjs/Subscriber";
    export function zipProto<T, R>(this: Observable<T>, project: (v1: T) => R): Observable<R>;
    export function zipProto<T, T2, R>(this: Observable<T>, v2: ObservableInput<T2>, project: (v1: T, v2: T2) => R): Observable<R>;
    export function zipProto<T, T2, T3, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, project: (v1: T, v2: T2, v3: T3) => R): Observable<R>;
    export function zipProto<T, T2, T3, T4, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, project: (v1: T, v2: T2, v3: T3, v4: T4) => R): Observable<R>;
    export function zipProto<T, T2, T3, T4, T5, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => R): Observable<R>;
    export function zipProto<T, T2, T3, T4, T5, T6, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => R): Observable<R>;
    export function zipProto<T, T2>(this: Observable<T>, v2: ObservableInput<T2>): Observable<[T, T2]>;
    export function zipProto<T, T2, T3>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<[T, T2, T3]>;
    export function zipProto<T, T2, T3, T4>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<[T, T2, T3, T4]>;
    export function zipProto<T, T2, T3, T4, T5>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<[T, T2, T3, T4, T5]>;
    export function zipProto<T, T2, T3, T4, T5, T6>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
    export function zipProto<T, R>(this: Observable<T>, ...observables: Array<ObservableInput<T> | ((...values: Array<T>) => R)>): Observable<R>;
    export function zipProto<T, R>(this: Observable<T>, array: Array<ObservableInput<T>>): Observable<R>;
    export function zipProto<T, TOther, R>(this: Observable<T>, array: Array<ObservableInput<TOther>>, project: (v1: T, ...values: Array<TOther>) => R): Observable<R>;
    export function zipStatic<T, T2>(v1: ObservableInput<T>, v2: ObservableInput<T2>): Observable<[T, T2]>;
    export function zipStatic<T, T2, T3>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<[T, T2, T3]>;
    export function zipStatic<T, T2, T3, T4>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<[T, T2, T3, T4]>;
    export function zipStatic<T, T2, T3, T4, T5>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<[T, T2, T3, T4, T5]>;
    export function zipStatic<T, T2, T3, T4, T5, T6>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
    export function zipStatic<T, R>(v1: ObservableInput<T>, project: (v1: T) => R): Observable<R>;
    export function zipStatic<T, T2, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, project: (v1: T, v2: T2) => R): Observable<R>;
    export function zipStatic<T, T2, T3, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, project: (v1: T, v2: T2, v3: T3) => R): Observable<R>;
    export function zipStatic<T, T2, T3, T4, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, project: (v1: T, v2: T2, v3: T3, v4: T4) => R): Observable<R>;
    export function zipStatic<T, T2, T3, T4, T5, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => R): Observable<R>;
    export function zipStatic<T, T2, T3, T4, T5, T6, R>(v1: ObservableInput<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => R): Observable<R>;
    export function zipStatic<T>(array: ObservableInput<T>[]): Observable<T[]>;
    export function zipStatic<R>(array: ObservableInput<any>[]): Observable<R>;
    export function zipStatic<T, R>(array: ObservableInput<T>[], project: (...values: Array<T>) => R): Observable<R>;
    export function zipStatic<R>(array: ObservableInput<any>[], project: (...values: Array<any>) => R): Observable<R>;
    export function zipStatic<T>(...observables: Array<ObservableInput<T>>): Observable<T[]>;
    export function zipStatic<T, R>(...observables: Array<ObservableInput<T> | ((...values: Array<T>) => R)>): Observable<R>;
    export function zipStatic<R>(...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
    export class ZipOperator<T, R> implements Operator<T, R> {
        project: (...values: Array<any>) => R;
        constructor(project?: (...values: Array<any>) => R);
        call(subscriber: Subscriber<R>, source: any): any;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class ZipSubscriber<T, R> extends Subscriber<T> {
        private values;
        private project;
        private iterators;
        private active;
        constructor(destination: Subscriber<R>, project?: (...values: Array<any>) => R, values?: any);
        protected _next(value: any): void;
        protected _complete(): void;
        notifyInactive(): void;
        checkIterators(): void;
        protected _tryProject(args: any[]): void;
    }
}
declare module "rxjs/observable/zip" {
    import { zipStatic } from "rxjs/operator/zip";
    export const zip: typeof zipStatic;
}
declare module "rxjs/add/observable/zip" {
    import { zip as zipStatic } from "rxjs/observable/zip";
    module "Observable" {
        namespace Observable {
            let zip: typeof zipStatic;
        }
    }
}
declare module "rxjs/operator/map" {
    import { Operator } from "rxjs/Operator";
    import { Subscriber } from "rxjs/Subscriber";
    import { Observable } from "rxjs/Observable";
    /**
     * Applies a given `project` function to each value emitted by the source
     * Observable, and emits the resulting values as an Observable.
     *
     * <span class="informal">Like [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map),
     * it passes each source value through a transformation function to get
     * corresponding output values.</span>
     *
     * <img src="./img/map.png" width="100%">
     *
     * Similar to the well known `Array.prototype.map` function, this operator
     * applies a projection to each value and emits that projection in the output
     * Observable.
     *
     * @example <caption>Map every click to the clientX position of that click</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var positions = clicks.map(ev => ev.clientX);
     * positions.subscribe(x => console.log(x));
     *
     * @see {@link mapTo}
     * @see {@link pluck}
     *
     * @param {function(value: T, index: number): R} project The function to apply
     * to each `value` emitted by the source Observable. The `index` parameter is
     * the number `i` for the i-th emission that has happened since the
     * subscription, starting from the number `0`.
     * @param {any} [thisArg] An optional argument to define what `this` is in the
     * `project` function.
     * @return {Observable<R>} An Observable that emits the values from the source
     * Observable transformed by the given `project` function.
     * @method map
     * @owner Observable
     */
    export function map<T, R>(this: Observable<T>, project: (value: T, index: number) => R, thisArg?: any): Observable<R>;
    export class MapOperator<T, R> implements Operator<T, R> {
        private project;
        private thisArg;
        constructor(project: (value: T, index: number) => R, thisArg: any);
        call(subscriber: Subscriber<R>, source: any): any;
    }
}
declare module "rxjs/observable/dom/AjaxObservable" {
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { TeardownLogic } from "rxjs/Subscription";
    export interface AjaxRequest {
        url?: string;
        body?: any;
        user?: string;
        async?: boolean;
        method?: string;
        headers?: Object;
        timeout?: number;
        password?: string;
        hasContent?: boolean;
        crossDomain?: boolean;
        withCredentials?: boolean;
        createXHR?: () => XMLHttpRequest;
        progressSubscriber?: Subscriber<any>;
        responseType?: string;
    }
    export interface AjaxCreationMethod {
        (urlOrRequest: string | AjaxRequest): Observable<AjaxResponse>;
        get(url: string, headers?: Object): Observable<AjaxResponse>;
        post(url: string, body?: any, headers?: Object): Observable<AjaxResponse>;
        put(url: string, body?: any, headers?: Object): Observable<AjaxResponse>;
        patch(url: string, body?: any, headers?: Object): Observable<AjaxResponse>;
        delete(url: string, headers?: Object): Observable<AjaxResponse>;
        getJSON<T>(url: string, headers?: Object): Observable<T>;
    }
    export function ajaxGet(url: string, headers?: Object): AjaxObservable<AjaxResponse>;
    export function ajaxPost(url: string, body?: any, headers?: Object): Observable<AjaxResponse>;
    export function ajaxDelete(url: string, headers?: Object): Observable<AjaxResponse>;
    export function ajaxPut(url: string, body?: any, headers?: Object): Observable<AjaxResponse>;
    export function ajaxPatch(url: string, body?: any, headers?: Object): Observable<AjaxResponse>;
    export function ajaxGetJSON<T>(url: string, headers?: Object): Observable<T>;
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class AjaxObservable<T> extends Observable<T> {
        /**
         * Creates an observable for an Ajax request with either a request object with
         * url, headers, etc or a string for a URL.
         *
         * @example
         * source = Rx.Observable.ajax('/products');
         * source = Rx.Observable.ajax({ url: 'products', method: 'GET' });
         *
         * @param {string|Object} request Can be one of the following:
         *   A string of the URL to make the Ajax call.
         *   An object with the following properties
         *   - url: URL of the request
         *   - body: The body of the request
         *   - method: Method of the request, such as GET, POST, PUT, PATCH, DELETE
         *   - async: Whether the request is async
         *   - headers: Optional headers
         *   - crossDomain: true if a cross domain request, else false
         *   - createXHR: a function to override if you need to use an alternate
         *   XMLHttpRequest implementation.
         *   - resultSelector: a function to use to alter the output value type of
         *   the Observable. Gets {@link AjaxResponse} as an argument.
         * @return {Observable} An observable sequence containing the XMLHttpRequest.
         * @static true
         * @name ajax
         * @owner Observable
        */
        static create: AjaxCreationMethod;
        private request;
        constructor(urlOrRequest: string | AjaxRequest);
        protected _subscribe(subscriber: Subscriber<T>): TeardownLogic;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class AjaxSubscriber<T> extends Subscriber<Event> {
        request: AjaxRequest;
        private xhr;
        private done;
        constructor(destination: Subscriber<T>, request: AjaxRequest);
        next(e: Event): void;
        private send();
        private serializeBody(body, contentType?);
        private setHeaders(xhr, headers);
        private setupEvents(xhr, request);
        unsubscribe(): void;
    }
    /**
     * A normalized AJAX response.
     *
     * @see {@link ajax}
     *
     * @class AjaxResponse
     */
    export class AjaxResponse {
        originalEvent: Event;
        xhr: XMLHttpRequest;
        request: AjaxRequest;
        /** @type {number} The HTTP status code */
        status: number;
        /** @type {string|ArrayBuffer|Document|object|any} The response data */
        response: any;
        /** @type {string} The raw responseText */
        responseText: string;
        /** @type {string} The responseType (e.g. 'json', 'arraybuffer', or 'xml') */
        responseType: string;
        constructor(originalEvent: Event, xhr: XMLHttpRequest, request: AjaxRequest);
    }
    /**
     * A normalized AJAX error.
     *
     * @see {@link ajax}
     *
     * @class AjaxError
     */
    export class AjaxError extends Error {
        /** @type {XMLHttpRequest} The XHR instance associated with the error */
        xhr: XMLHttpRequest;
        /** @type {AjaxRequest} The AjaxRequest associated with the error */
        request: AjaxRequest;
        /** @type {number} The HTTP status code */
        status: number;
        constructor(message: string, xhr: XMLHttpRequest, request: AjaxRequest);
    }
    /**
     * @see {@link ajax}
     *
     * @class AjaxTimeoutError
     */
    export class AjaxTimeoutError extends AjaxError {
        constructor(xhr: XMLHttpRequest, request: AjaxRequest);
    }
}
declare module "rxjs/observable/dom/ajax" {
    import { AjaxCreationMethod } from "rxjs/observable/dom/AjaxObservable";
    export const ajax: AjaxCreationMethod;
}
declare module "rxjs/add/observable/dom/ajax" {
    import { AjaxCreationMethod } from "rxjs/observable/dom/AjaxObservable";
    module "Observable" {
        namespace Observable {
            let ajax: AjaxCreationMethod;
        }
    }
}
declare module "rxjs/scheduler/QueueScheduler" {
    import { AsyncScheduler } from "rxjs/scheduler/AsyncScheduler";
    export class QueueScheduler extends AsyncScheduler {
    }
}
declare module "rxjs/scheduler/QueueAction" {
    import { AsyncAction } from "rxjs/scheduler/AsyncAction";
    import { Subscription } from "rxjs/Subscription";
    import { QueueScheduler } from "rxjs/scheduler/QueueScheduler";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class QueueAction<T> extends AsyncAction<T> {
        protected scheduler: QueueScheduler;
        protected work: (this: QueueAction<T>, state?: T) => void;
        constructor(scheduler: QueueScheduler, work: (this: QueueAction<T>, state?: T) => void);
        schedule(state?: T, delay?: number): Subscription;
        execute(state: T, delay: number): any;
        protected requestAsyncId(scheduler: QueueScheduler, id?: any, delay?: number): any;
    }
}
declare module "rxjs/scheduler/queue" {
    import { QueueScheduler } from "rxjs/scheduler/QueueScheduler";
    /**
     *
     * Queue Scheduler
     *
     * <span class="informal">Put every next task on a queue, instead of executing it immediately</span>
     *
     * `queue` scheduler, when used with delay, behaves the same as {@link async} scheduler.
     *
     * When used without delay, it schedules given task synchronously - executes it right when
     * it is scheduled. However when called recursively, that is when inside the scheduled task,
     * another task is scheduled with queue scheduler, instead of executing immediately as well,
     * that task will be put on a queue and wait for current one to finish.
     *
     * This means that when you execute task with `queue` scheduler, you are sure it will end
     * before any other task scheduled with that scheduler will start.
     *
     * @examples <caption>Schedule recursively first, then do something</caption>
     *
     * Rx.Scheduler.queue.schedule(() => {
     *   Rx.Scheduler.queue.schedule(() => console.log('second')); // will not happen now, but will be put on a queue
     *
     *   console.log('first');
     * });
     *
     * // Logs:
     * // "first"
     * // "second"
     *
     *
     * @example <caption>Reschedule itself recursively</caption>
     *
     * Rx.Scheduler.queue.schedule(function(state) {
     *   if (state !== 0) {
     *     console.log('before', state);
     *     this.schedule(state - 1); // `this` references currently executing Action,
     *                               // which we reschedule with new state
     *     console.log('after', state);
     *   }
     * }, 0, 3);
     *
     * // In scheduler that runs recursively, you would expect:
     * // "before", 3
     * // "before", 2
     * // "before", 1
     * // "after", 1
     * // "after", 2
     * // "after", 3
     *
     * // But with queue it logs:
     * // "before", 3
     * // "after", 3
     * // "before", 2
     * // "after", 2
     * // "before", 1
     * // "after", 1
     *
     *
     * @static true
     * @name queue
     * @owner Scheduler
     */
    export const queue: QueueScheduler;
}
declare module "rxjs/ReplaySubject" {
    import { Subject } from "rxjs/Subject";
    import { IScheduler } from "rxjs/Scheduler";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    /**
     * @class ReplaySubject<T>
     */
    export class ReplaySubject<T> extends Subject<T> {
        private scheduler;
        private _events;
        private _bufferSize;
        private _windowTime;
        constructor(bufferSize?: number, windowTime?: number, scheduler?: IScheduler);
        next(value: T): void;
        protected _subscribe(subscriber: Subscriber<T>): Subscription;
        _getNow(): number;
        private _trimBufferThenGetEvents();
    }
}
declare module "rxjs/util/assign" {
    export function assignImpl(target: Object, ...sources: Object[]): Object;
    export function getAssign(root: any): any;
    export const assign: any;
}
declare module "rxjs/observable/dom/WebSocketSubject" {
    import { AnonymousSubject } from "rxjs/Subject";
    import { Subscriber } from "rxjs/Subscriber";
    import { Observable } from "rxjs/Observable";
    import { Subscription } from "rxjs/Subscription";
    import { Operator } from "rxjs/Operator";
    import { Observer, NextObserver } from "rxjs/Observer";
    export interface WebSocketSubjectConfig {
        url: string;
        protocol?: string | Array<string>;
        resultSelector?: <T>(e: MessageEvent) => T;
        openObserver?: NextObserver<Event>;
        closeObserver?: NextObserver<CloseEvent>;
        closingObserver?: NextObserver<void>;
        WebSocketCtor?: {
            new (url: string, protocol?: string | Array<string>): WebSocket;
        };
        binaryType?: 'blob' | 'arraybuffer';
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class WebSocketSubject<T> extends AnonymousSubject<T> {
        url: string;
        protocol: string | Array<string>;
        socket: WebSocket;
        openObserver: NextObserver<Event>;
        closeObserver: NextObserver<CloseEvent>;
        closingObserver: NextObserver<void>;
        WebSocketCtor: {
            new (url: string, protocol?: string | Array<string>): WebSocket;
        };
        binaryType?: 'blob' | 'arraybuffer';
        private _output;
        resultSelector(e: MessageEvent): any;
        /**
         * Wrapper around the w3c-compatible WebSocket object provided by the browser.
         *
         * @example <caption>Wraps browser WebSocket</caption>
         *
         * let socket$ = Observable.webSocket('ws://localhost:8081');
         *
         * socket$.subscribe(
         *    (msg) => console.log('message received: ' + msg),
         *    (err) => console.log(err),
         *    () => console.log('complete')
         *  );
         *
         * socket$.next(JSON.stringify({ op: 'hello' }));
         *
         * @example <caption>Wraps WebSocket from nodejs-websocket (using node.js)</caption>
         *
         * import { w3cwebsocket } from 'websocket';
         *
         * let socket$ = Observable.webSocket({
         *   url: 'ws://localhost:8081',
         *   WebSocketCtor: w3cwebsocket
         * });
         *
         * socket$.subscribe(
         *    (msg) => console.log('message received: ' + msg),
         *    (err) => console.log(err),
         *    () => console.log('complete')
         *  );
         *
         * socket$.next(JSON.stringify({ op: 'hello' }));
         *
         * @param {string | WebSocketSubjectConfig} urlConfigOrSource the source of the websocket as an url or a structure defining the websocket object
         * @return {WebSocketSubject}
         * @static true
         * @name webSocket
         * @owner Observable
         */
        static create<T>(urlConfigOrSource: string | WebSocketSubjectConfig): WebSocketSubject<T>;
        constructor(urlConfigOrSource: string | WebSocketSubjectConfig | Observable<T>, destination?: Observer<T>);
        lift<R>(operator: Operator<T, R>): WebSocketSubject<R>;
        private _resetState();
        multiplex(subMsg: () => any, unsubMsg: () => any, messageFilter: (value: T) => boolean): Observable<any>;
        private _connectSocket();
        protected _subscribe(subscriber: Subscriber<T>): Subscription;
        unsubscribe(): void;
    }
}
declare module "rxjs/observable/dom/webSocket" {
    import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
    export const webSocket: typeof WebSocketSubject.create;
}
declare module "rxjs/add/observable/dom/webSocket" {
    import { webSocket as staticWebSocket } from "rxjs/observable/dom/webSocket";
    module "Observable" {
        namespace Observable {
            let webSocket: typeof staticWebSocket;
        }
    }
}
declare module "rxjs/operator/buffer" {
    import { Observable } from "rxjs/Observable";
    /**
     * Buffers the source Observable values until `closingNotifier` emits.
     *
     * <span class="informal">Collects values from the past as an array, and emits
     * that array only when another Observable emits.</span>
     *
     * <img src="./img/buffer.png" width="100%">
     *
     * Buffers the incoming Observable values until the given `closingNotifier`
     * Observable emits a value, at which point it emits the buffer on the output
     * Observable and starts a new buffer internally, awaiting the next time
     * `closingNotifier` emits.
     *
     * @example <caption>On every click, emit array of most recent interval events</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var interval = Rx.Observable.interval(1000);
     * var buffered = interval.buffer(clicks);
     * buffered.subscribe(x => console.log(x));
     *
     * @see {@link bufferCount}
     * @see {@link bufferTime}
     * @see {@link bufferToggle}
     * @see {@link bufferWhen}
     * @see {@link window}
     *
     * @param {Observable<any>} closingNotifier An Observable that signals the
     * buffer to be emitted on the output Observable.
     * @return {Observable<T[]>} An Observable of buffers, which are arrays of
     * values.
     * @method buffer
     * @owner Observable
     */
    export function buffer<T>(this: Observable<T>, closingNotifier: Observable<any>): Observable<T[]>;
}
declare module "rxjs/add/operator/buffer" {
    import { buffer } from "rxjs/operator/buffer";
    module "Observable" {
        interface Observable<T> {
            buffer: typeof buffer;
        }
    }
}
declare module "rxjs/operator/bufferCount" {
    import { Observable } from "rxjs/Observable";
    /**
     * Buffers the source Observable values until the size hits the maximum
     * `bufferSize` given.
     *
     * <span class="informal">Collects values from the past as an array, and emits
     * that array only when its size reaches `bufferSize`.</span>
     *
     * <img src="./img/bufferCount.png" width="100%">
     *
     * Buffers a number of values from the source Observable by `bufferSize` then
     * emits the buffer and clears it, and starts a new buffer each
     * `startBufferEvery` values. If `startBufferEvery` is not provided or is
     * `null`, then new buffers are started immediately at the start of the source
     * and when each buffer closes and is emitted.
     *
     * @example <caption>Emit the last two click events as an array</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var buffered = clicks.bufferCount(2);
     * buffered.subscribe(x => console.log(x));
     *
     * @example <caption>On every click, emit the last two click events as an array</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var buffered = clicks.bufferCount(2, 1);
     * buffered.subscribe(x => console.log(x));
     *
     * @see {@link buffer}
     * @see {@link bufferTime}
     * @see {@link bufferToggle}
     * @see {@link bufferWhen}
     * @see {@link pairwise}
     * @see {@link windowCount}
     *
     * @param {number} bufferSize The maximum size of the buffer emitted.
     * @param {number} [startBufferEvery] Interval at which to start a new buffer.
     * For example if `startBufferEvery` is `2`, then a new buffer will be started
     * on every other value from the source. A new buffer is started at the
     * beginning of the source by default.
     * @return {Observable<T[]>} An Observable of arrays of buffered values.
     * @method bufferCount
     * @owner Observable
     */
    export function bufferCount<T>(this: Observable<T>, bufferSize: number, startBufferEvery?: number): Observable<T[]>;
}
declare module "rxjs/add/operator/bufferCount" {
    import { bufferCount } from "rxjs/operator/bufferCount";
    module "Observable" {
        interface Observable<T> {
            bufferCount: typeof bufferCount;
        }
    }
}
declare module "rxjs/operator/bufferTime" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    export function bufferTime<T>(this: Observable<T>, bufferTimeSpan: number, scheduler?: IScheduler): Observable<T[]>;
    export function bufferTime<T>(this: Observable<T>, bufferTimeSpan: number, bufferCreationInterval: number, scheduler?: IScheduler): Observable<T[]>;
    export function bufferTime<T>(this: Observable<T>, bufferTimeSpan: number, bufferCreationInterval: number, maxBufferSize: number, scheduler?: IScheduler): Observable<T[]>;
}
declare module "rxjs/add/operator/bufferTime" {
    import { bufferTime } from "rxjs/operator/bufferTime";
    module "Observable" {
        interface Observable<T> {
            bufferTime: typeof bufferTime;
        }
    }
}
declare module "rxjs/operator/bufferToggle" {
    import { Observable, SubscribableOrPromise } from "rxjs/Observable";
    /**
     * Buffers the source Observable values starting from an emission from
     * `openings` and ending when the output of `closingSelector` emits.
     *
     * <span class="informal">Collects values from the past as an array. Starts
     * collecting only when `opening` emits, and calls the `closingSelector`
     * function to get an Observable that tells when to close the buffer.</span>
     *
     * <img src="./img/bufferToggle.png" width="100%">
     *
     * Buffers values from the source by opening the buffer via signals from an
     * Observable provided to `openings`, and closing and sending the buffers when
     * a Subscribable or Promise returned by the `closingSelector` function emits.
     *
     * @example <caption>Every other second, emit the click events from the next 500ms</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var openings = Rx.Observable.interval(1000);
     * var buffered = clicks.bufferToggle(openings, i =>
     *   i % 2 ? Rx.Observable.interval(500) : Rx.Observable.empty()
     * );
     * buffered.subscribe(x => console.log(x));
     *
     * @see {@link buffer}
     * @see {@link bufferCount}
     * @see {@link bufferTime}
     * @see {@link bufferWhen}
     * @see {@link windowToggle}
     *
     * @param {SubscribableOrPromise<O>} openings A Subscribable or Promise of notifications to start new
     * buffers.
     * @param {function(value: O): SubscribableOrPromise} closingSelector A function that takes
     * the value emitted by the `openings` observable and returns a Subscribable or Promise,
     * which, when it emits, signals that the associated buffer should be emitted
     * and cleared.
     * @return {Observable<T[]>} An observable of arrays of buffered values.
     * @method bufferToggle
     * @owner Observable
     */
    export function bufferToggle<T, O>(this: Observable<T>, openings: SubscribableOrPromise<O>, closingSelector: (value: O) => SubscribableOrPromise<any>): Observable<T[]>;
}
declare module "rxjs/add/operator/bufferToggle" {
    import { bufferToggle } from "rxjs/operator/bufferToggle";
    module "Observable" {
        interface Observable<T> {
            bufferToggle: typeof bufferToggle;
        }
    }
}
declare module "rxjs/operator/bufferWhen" {
    import { Observable } from "rxjs/Observable";
    /**
     * Buffers the source Observable values, using a factory function of closing
     * Observables to determine when to close, emit, and reset the buffer.
     *
     * <span class="informal">Collects values from the past as an array. When it
     * starts collecting values, it calls a function that returns an Observable that
     * tells when to close the buffer and restart collecting.</span>
     *
     * <img src="./img/bufferWhen.png" width="100%">
     *
     * Opens a buffer immediately, then closes the buffer when the observable
     * returned by calling `closingSelector` function emits a value. When it closes
     * the buffer, it immediately opens a new buffer and repeats the process.
     *
     * @example <caption>Emit an array of the last clicks every [1-5] random seconds</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var buffered = clicks.bufferWhen(() =>
     *   Rx.Observable.interval(1000 + Math.random() * 4000)
     * );
     * buffered.subscribe(x => console.log(x));
     *
     * @see {@link buffer}
     * @see {@link bufferCount}
     * @see {@link bufferTime}
     * @see {@link bufferToggle}
     * @see {@link windowWhen}
     *
     * @param {function(): Observable} closingSelector A function that takes no
     * arguments and returns an Observable that signals buffer closure.
     * @return {Observable<T[]>} An observable of arrays of buffered values.
     * @method bufferWhen
     * @owner Observable
     */
    export function bufferWhen<T>(this: Observable<T>, closingSelector: () => Observable<any>): Observable<T[]>;
}
declare module "rxjs/add/operator/bufferWhen" {
    import { bufferWhen } from "rxjs/operator/bufferWhen";
    module "Observable" {
        interface Observable<T> {
            bufferWhen: typeof bufferWhen;
        }
    }
}
declare module "rxjs/operator/catch" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    /**
     * Catches errors on the observable to be handled by returning a new observable or throwing an error.
     *
     * <img src="./img/catch.png" width="100%">
     *
     * @example <caption>Continues with a different Observable when there's an error</caption>
     *
     * Observable.of(1, 2, 3, 4, 5)
     *   .map(n => {
     * 	   if (n == 4) {
     * 	     throw 'four!';
     *     }
     *	   return n;
     *   })
     *   .catch(err => Observable.of('I', 'II', 'III', 'IV', 'V'))
     *   .subscribe(x => console.log(x));
     *   // 1, 2, 3, I, II, III, IV, V
     *
     * @example <caption>Retries the caught source Observable again in case of error, similar to retry() operator</caption>
     *
     * Observable.of(1, 2, 3, 4, 5)
     *   .map(n => {
     * 	   if (n === 4) {
     * 	     throw 'four!';
     *     }
     * 	   return n;
     *   })
     *   .catch((err, caught) => caught)
     *   .take(30)
     *   .subscribe(x => console.log(x));
     *   // 1, 2, 3, 1, 2, 3, ...
     *
     * @example <caption>Throws a new error when the source Observable throws an error</caption>
     *
     * Observable.of(1, 2, 3, 4, 5)
     *   .map(n => {
     *     if (n == 4) {
     *       throw 'four!';
     *     }
     *     return n;
     *   })
     *   .catch(err => {
     *     throw 'error in source. Details: ' + err;
     *   })
     *   .subscribe(
     *     x => console.log(x),
     *     err => console.log(err)
     *   );
     *   // 1, 2, 3, error in source. Details: four!
     *
     * @param {function} selector a function that takes as arguments `err`, which is the error, and `caught`, which
     *  is the source observable, in case you'd like to "retry" that observable by returning it again. Whatever observable
     *  is returned by the `selector` will be used to continue the observable chain.
     * @return {Observable} An observable that originates from either the source or the observable returned by the
     *  catch `selector` function.
     * @method catch
     * @name catch
     * @owner Observable
     */
    export function _catch<T, R>(this: Observable<T>, selector: (err: any, caught: Observable<T>) => ObservableInput<R>): Observable<T | R>;
}
declare module "rxjs/add/operator/catch" {
    import { _catch } from "rxjs/operator/catch";
    module "Observable" {
        interface Observable<T> {
            catch: typeof _catch;
            _catch: typeof _catch;
        }
    }
}
declare module "rxjs/operator/combineAll" {
    import { Observable } from "rxjs/Observable";
    /**
     * Converts a higher-order Observable into a first-order Observable by waiting
     * for the outer Observable to complete, then applying {@link combineLatest}.
     *
     * <span class="informal">Flattens an Observable-of-Observables by applying
     * {@link combineLatest} when the Observable-of-Observables completes.</span>
     *
     * <img src="./img/combineAll.png" width="100%">
     *
     * Takes an Observable of Observables, and collects all Observables from it.
     * Once the outer Observable completes, it subscribes to all collected
     * Observables and combines their values using the {@link combineLatest}
     * strategy, such that:
     * - Every time an inner Observable emits, the output Observable emits.
     * - When the returned observable emits, it emits all of the latest values by:
     *   - If a `project` function is provided, it is called with each recent value
     *     from each inner Observable in whatever order they arrived, and the result
     *     of the `project` function is what is emitted by the output Observable.
     *   - If there is no `project` function, an array of all of the most recent
     *     values is emitted by the output Observable.
     *
     * @example <caption>Map two click events to a finite interval Observable, then apply combineAll</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var higherOrder = clicks.map(ev =>
     *   Rx.Observable.interval(Math.random()*2000).take(3)
     * ).take(2);
     * var result = higherOrder.combineAll();
     * result.subscribe(x => console.log(x));
     *
     * @see {@link combineLatest}
     * @see {@link mergeAll}
     *
     * @param {function} [project] An optional function to map the most recent
     * values from each inner Observable into a new result. Takes each of the most
     * recent values from each collected inner Observable as arguments, in order.
     * @return {Observable} An Observable of projected results or arrays of recent
     * values.
     * @method combineAll
     * @owner Observable
     */
    export function combineAll<T, R>(this: Observable<T>, project?: (...values: Array<any>) => R): Observable<R>;
}
declare module "rxjs/add/operator/combineAll" {
    import { combineAll } from "rxjs/operator/combineAll";
    module "Observable" {
        interface Observable<T> {
            combineAll: typeof combineAll;
        }
    }
}
declare module "rxjs/add/operator/combineLatest" {
    import { combineLatest } from "rxjs/operator/combineLatest";
    module "Observable" {
        interface Observable<T> {
            combineLatest: typeof combineLatest;
        }
    }
}
declare module "rxjs/add/operator/concat" {
    import { concat } from "rxjs/operator/concat";
    module "Observable" {
        interface Observable<T> {
            concat: typeof concat;
        }
    }
}
declare module "rxjs/operator/concatAll" {
    import { Observable } from "rxjs/Observable";
    import { Subscribable } from "rxjs/Observable";
    export function concatAll<T>(this: Observable<T>): T;
    export function concatAll<T, R>(this: Observable<T>): Subscribable<R>;
}
declare module "rxjs/add/operator/concatAll" {
    import { concatAll } from "rxjs/operator/concatAll";
    module "Observable" {
        interface Observable<T> {
            concatAll: typeof concatAll;
        }
    }
}
declare module "rxjs/operator/mergeMap" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    import { Operator } from "rxjs/Operator";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    import { OuterSubscriber } from "rxjs/OuterSubscriber";
    import { InnerSubscriber } from "rxjs/InnerSubscriber";
    export function mergeMap<T, R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<R>, concurrent?: number): Observable<R>;
    export function mergeMap<T, I, R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<I>, resultSelector: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R, concurrent?: number): Observable<R>;
    export class MergeMapOperator<T, I, R> implements Operator<T, I> {
        private project;
        private resultSelector;
        private concurrent;
        constructor(project: (value: T, index: number) => ObservableInput<I>, resultSelector?: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R, concurrent?: number);
        call(observer: Subscriber<I>, source: any): any;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class MergeMapSubscriber<T, I, R> extends OuterSubscriber<T, I> {
        private project;
        private resultSelector;
        private concurrent;
        private hasCompleted;
        private buffer;
        private active;
        protected index: number;
        constructor(destination: Subscriber<I>, project: (value: T, index: number) => ObservableInput<I>, resultSelector?: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R, concurrent?: number);
        protected _next(value: T): void;
        protected _tryNext(value: T): void;
        private _innerSub(ish, value, index);
        protected _complete(): void;
        notifyNext(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, I>): void;
        private _notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
        notifyComplete(innerSub: Subscription): void;
    }
}
declare module "rxjs/operator/concatMap" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    export function concatMap<T, R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<R>): Observable<R>;
    export function concatMap<T, I, R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<I>, resultSelector: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R): Observable<R>;
}
declare module "rxjs/add/operator/concatMap" {
    import { concatMap } from "rxjs/operator/concatMap";
    module "Observable" {
        interface Observable<T> {
            concatMap: typeof concatMap;
        }
    }
}
declare module "rxjs/operator/mergeMapTo" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    import { Operator } from "rxjs/Operator";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    import { OuterSubscriber } from "rxjs/OuterSubscriber";
    import { InnerSubscriber } from "rxjs/InnerSubscriber";
    export function mergeMapTo<T, R>(this: Observable<T>, observable: ObservableInput<R>, concurrent?: number): Observable<R>;
    export function mergeMapTo<T, I, R>(this: Observable<T>, observable: ObservableInput<I>, resultSelector: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R, concurrent?: number): Observable<R>;
    export class MergeMapToOperator<T, I, R> implements Operator<Observable<T>, R> {
        private ish;
        private resultSelector;
        private concurrent;
        constructor(ish: ObservableInput<I>, resultSelector?: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R, concurrent?: number);
        call(observer: Subscriber<R>, source: any): any;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class MergeMapToSubscriber<T, I, R> extends OuterSubscriber<T, I> {
        private ish;
        private resultSelector;
        private concurrent;
        private hasCompleted;
        private buffer;
        private active;
        protected index: number;
        constructor(destination: Subscriber<R>, ish: ObservableInput<I>, resultSelector?: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R, concurrent?: number);
        protected _next(value: T): void;
        private _innerSub(ish, destination, resultSelector, value, index);
        protected _complete(): void;
        notifyNext(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, I>): void;
        private trySelectResult(outerValue, innerValue, outerIndex, innerIndex);
        notifyError(err: any): void;
        notifyComplete(innerSub: Subscription): void;
    }
}
declare module "rxjs/operator/concatMapTo" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    export function concatMapTo<T, R>(this: Observable<T>, observable: ObservableInput<R>): Observable<R>;
    export function concatMapTo<T, I, R>(this: Observable<T>, observable: ObservableInput<I>, resultSelector: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R): Observable<R>;
}
declare module "rxjs/add/operator/concatMapTo" {
    import { concatMapTo } from "rxjs/operator/concatMapTo";
    module "Observable" {
        interface Observable<T> {
            concatMapTo: typeof concatMapTo;
        }
    }
}
declare module "rxjs/operator/count" {
    import { Observable } from "rxjs/Observable";
    /**
     * Counts the number of emissions on the source and emits that number when the
     * source completes.
     *
     * <span class="informal">Tells how many values were emitted, when the source
     * completes.</span>
     *
     * <img src="./img/count.png" width="100%">
     *
     * `count` transforms an Observable that emits values into an Observable that
     * emits a single value that represents the number of values emitted by the
     * source Observable. If the source Observable terminates with an error, `count`
     * will pass this error notification along without emitting a value first. If
     * the source Observable does not terminate at all, `count` will neither emit
     * a value nor terminate. This operator takes an optional `predicate` function
     * as argument, in which case the output emission will represent the number of
     * source values that matched `true` with the `predicate`.
     *
     * @example <caption>Counts how many seconds have passed before the first click happened</caption>
     * var seconds = Rx.Observable.interval(1000);
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var secondsBeforeClick = seconds.takeUntil(clicks);
     * var result = secondsBeforeClick.count();
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Counts how many odd numbers are there between 1 and 7</caption>
     * var numbers = Rx.Observable.range(1, 7);
     * var result = numbers.count(i => i % 2 === 1);
     * result.subscribe(x => console.log(x));
     *
     * // Results in:
     * // 4
     *
     * @see {@link max}
     * @see {@link min}
     * @see {@link reduce}
     *
     * @param {function(value: T, i: number, source: Observable<T>): boolean} [predicate] A
     * boolean function to select what values are to be counted. It is provided with
     * arguments of:
     * - `value`: the value from the source Observable.
     * - `index`: the (zero-based) "index" of the value from the source Observable.
     * - `source`: the source Observable instance itself.
     * @return {Observable} An Observable of one number that represents the count as
     * described above.
     * @method count
     * @owner Observable
     */
    export function count<T>(this: Observable<T>, predicate?: (value: T, index: number, source: Observable<T>) => boolean): Observable<number>;
}
declare module "rxjs/add/operator/count" {
    import { count } from "rxjs/operator/count";
    module "Observable" {
        interface Observable<T> {
            count: typeof count;
        }
    }
}
declare module "rxjs/operator/dematerialize" {
    import { Observable } from "rxjs/Observable";
    /**
     * Converts an Observable of {@link Notification} objects into the emissions
     * that they represent.
     *
     * <span class="informal">Unwraps {@link Notification} objects as actual `next`,
     * `error` and `complete` emissions. The opposite of {@link materialize}.</span>
     *
     * <img src="./img/dematerialize.png" width="100%">
     *
     * `dematerialize` is assumed to operate an Observable that only emits
     * {@link Notification} objects as `next` emissions, and does not emit any
     * `error`. Such Observable is the output of a `materialize` operation. Those
     * notifications are then unwrapped using the metadata they contain, and emitted
     * as `next`, `error`, and `complete` on the output Observable.
     *
     * Use this operator in conjunction with {@link materialize}.
     *
     * @example <caption>Convert an Observable of Notifications to an actual Observable</caption>
     * var notifA = new Rx.Notification('N', 'A');
     * var notifB = new Rx.Notification('N', 'B');
     * var notifE = new Rx.Notification('E', void 0,
     *   new TypeError('x.toUpperCase is not a function')
     * );
     * var materialized = Rx.Observable.of(notifA, notifB, notifE);
     * var upperCase = materialized.dematerialize();
     * upperCase.subscribe(x => console.log(x), e => console.error(e));
     *
     * // Results in:
     * // A
     * // B
     * // TypeError: x.toUpperCase is not a function
     *
     * @see {@link Notification}
     * @see {@link materialize}
     *
     * @return {Observable} An Observable that emits items and notifications
     * embedded in Notification objects emitted by the source Observable.
     * @method dematerialize
     * @owner Observable
     */
    export function dematerialize<T>(this: Observable<T>): Observable<any>;
}
declare module "rxjs/add/operator/dematerialize" {
    import { dematerialize } from "rxjs/operator/dematerialize";
    module "Observable" {
        interface Observable<T> {
            dematerialize: typeof dematerialize;
        }
    }
}
declare module "rxjs/operator/debounce" {
    import { Observable, SubscribableOrPromise } from "rxjs/Observable";
    /**
     * Emits a value from the source Observable only after a particular time span
     * determined by another Observable has passed without another source emission.
     *
     * <span class="informal">It's like {@link debounceTime}, but the time span of
     * emission silence is determined by a second Observable.</span>
     *
     * <img src="./img/debounce.png" width="100%">
     *
     * `debounce` delays values emitted by the source Observable, but drops previous
     * pending delayed emissions if a new value arrives on the source Observable.
     * This operator keeps track of the most recent value from the source
     * Observable, and spawns a duration Observable by calling the
     * `durationSelector` function. The value is emitted only when the duration
     * Observable emits a value or completes, and if no other value was emitted on
     * the source Observable since the duration Observable was spawned. If a new
     * value appears before the duration Observable emits, the previous value will
     * be dropped and will not be emitted on the output Observable.
     *
     * Like {@link debounceTime}, this is a rate-limiting operator, and also a
     * delay-like operator since output emissions do not necessarily occur at the
     * same time as they did on the source Observable.
     *
     * @example <caption>Emit the most recent click after a burst of clicks</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.debounce(() => Rx.Observable.interval(1000));
     * result.subscribe(x => console.log(x));
     *
     * @see {@link audit}
     * @see {@link debounceTime}
     * @see {@link delayWhen}
     * @see {@link throttle}
     *
     * @param {function(value: T): SubscribableOrPromise} durationSelector A function
     * that receives a value from the source Observable, for computing the timeout
     * duration for each source value, returned as an Observable or a Promise.
     * @return {Observable} An Observable that delays the emissions of the source
     * Observable by the specified duration Observable returned by
     * `durationSelector`, and may drop some values if they occur too frequently.
     * @method debounce
     * @owner Observable
     */
    export function debounce<T>(this: Observable<T>, durationSelector: (value: T) => SubscribableOrPromise<number>): Observable<T>;
}
declare module "rxjs/add/operator/debounce" {
    import { debounce } from "rxjs/operator/debounce";
    module "Observable" {
        interface Observable<T> {
            debounce: typeof debounce;
        }
    }
}
declare module "rxjs/operator/debounceTime" {
    import { Observable } from "rxjs/Observable";
    import { IScheduler } from "rxjs/Scheduler";
    /**
     * Emits a value from the source Observable only after a particular time span
     * has passed without another source emission.
     *
     * <span class="informal">It's like {@link delay}, but passes only the most
     * recent value from each burst of emissions.</span>
     *
     * <img src="./img/debounceTime.png" width="100%">
     *
     * `debounceTime` delays values emitted by the source Observable, but drops
     * previous pending delayed emissions if a new value arrives on the source
     * Observable. This operator keeps track of the most recent value from the
     * source Observable, and emits that only when `dueTime` enough time has passed
     * without any other value appearing on the source Observable. If a new value
     * appears before `dueTime` silence occurs, the previous value will be dropped
     * and will not be emitted on the output Observable.
     *
     * This is a rate-limiting operator, because it is impossible for more than one
     * value to be emitted in any time window of duration `dueTime`, but it is also
     * a delay-like operator since output emissions do not occur at the same time as
     * they did on the source Observable. Optionally takes a {@link IScheduler} for
     * managing timers.
     *
     * @example <caption>Emit the most recent click after a burst of clicks</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.debounceTime(1000);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link auditTime}
     * @see {@link debounce}
     * @see {@link delay}
     * @see {@link sampleTime}
     * @see {@link throttleTime}
     *
     * @param {number} dueTime The timeout duration in milliseconds (or the time
     * unit determined internally by the optional `scheduler`) for the window of
     * time required to wait for emission silence before emitting the most recent
     * source value.
     * @param {Scheduler} [scheduler=async] The {@link IScheduler} to use for
     * managing the timers that handle the timeout for each value.
     * @return {Observable} An Observable that delays the emissions of the source
     * Observable by the specified `dueTime`, and may drop some values if they occur
     * too frequently.
     * @method debounceTime
     * @owner Observable
     */
    export function debounceTime<T>(this: Observable<T>, dueTime: number, scheduler?: IScheduler): Observable<T>;
}
declare module "rxjs/add/operator/debounceTime" {
    import { debounceTime } from "rxjs/operator/debounceTime";
    module "Observable" {
        interface Observable<T> {
            debounceTime: typeof debounceTime;
        }
    }
}
declare module "rxjs/operator/defaultIfEmpty" {
    import { Observable } from "rxjs/Observable";
    export function defaultIfEmpty<T>(this: Observable<T>, defaultValue?: T): Observable<T>;
    export function defaultIfEmpty<T, R>(this: Observable<T>, defaultValue?: R): Observable<T | R>;
}
declare module "rxjs/add/operator/defaultIfEmpty" {
    import { defaultIfEmpty } from "rxjs/operator/defaultIfEmpty";
    module "Observable" {
        interface Observable<T> {
            defaultIfEmpty: typeof defaultIfEmpty;
        }
    }
}
declare module "rxjs/operator/delay" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    /**
     * Delays the emission of items from the source Observable by a given timeout or
     * until a given Date.
     *
     * <span class="informal">Time shifts each item by some specified amount of
     * milliseconds.</span>
     *
     * <img src="./img/delay.png" width="100%">
     *
     * If the delay argument is a Number, this operator time shifts the source
     * Observable by that amount of time expressed in milliseconds. The relative
     * time intervals between the values are preserved.
     *
     * If the delay argument is a Date, this operator time shifts the start of the
     * Observable execution until the given date occurs.
     *
     * @example <caption>Delay each click by one second</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var delayedClicks = clicks.delay(1000); // each click emitted after 1 second
     * delayedClicks.subscribe(x => console.log(x));
     *
     * @example <caption>Delay all clicks until a future date happens</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var date = new Date('March 15, 2050 12:00:00'); // in the future
     * var delayedClicks = clicks.delay(date); // click emitted only after that date
     * delayedClicks.subscribe(x => console.log(x));
     *
     * @see {@link debounceTime}
     * @see {@link delayWhen}
     *
     * @param {number|Date} delay The delay duration in milliseconds (a `number`) or
     * a `Date` until which the emission of the source items is delayed.
     * @param {Scheduler} [scheduler=async] The IScheduler to use for
     * managing the timers that handle the time-shift for each item.
     * @return {Observable} An Observable that delays the emissions of the source
     * Observable by the specified timeout or Date.
     * @method delay
     * @owner Observable
     */
    export function delay<T>(this: Observable<T>, delay: number | Date, scheduler?: IScheduler): Observable<T>;
}
declare module "rxjs/add/operator/delay" {
    import { delay } from "rxjs/operator/delay";
    module "Observable" {
        interface Observable<T> {
            delay: typeof delay;
        }
    }
}
declare module "rxjs/operator/delayWhen" {
    import { Observable } from "rxjs/Observable";
    /**
     * Delays the emission of items from the source Observable by a given time span
     * determined by the emissions of another Observable.
     *
     * <span class="informal">It's like {@link delay}, but the time span of the
     * delay duration is determined by a second Observable.</span>
     *
     * <img src="./img/delayWhen.png" width="100%">
     *
     * `delayWhen` time shifts each emitted value from the source Observable by a
     * time span determined by another Observable. When the source emits a value,
     * the `delayDurationSelector` function is called with the source value as
     * argument, and should return an Observable, called the "duration" Observable.
     * The source value is emitted on the output Observable only when the duration
     * Observable emits a value or completes.
     *
     * Optionally, `delayWhen` takes a second argument, `subscriptionDelay`, which
     * is an Observable. When `subscriptionDelay` emits its first value or
     * completes, the source Observable is subscribed to and starts behaving like
     * described in the previous paragraph. If `subscriptionDelay` is not provided,
     * `delayWhen` will subscribe to the source Observable as soon as the output
     * Observable is subscribed.
     *
     * @example <caption>Delay each click by a random amount of time, between 0 and 5 seconds</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var delayedClicks = clicks.delayWhen(event =>
     *   Rx.Observable.interval(Math.random() * 5000)
     * );
     * delayedClicks.subscribe(x => console.log(x));
     *
     * @see {@link debounce}
     * @see {@link delay}
     *
     * @param {function(value: T): Observable} delayDurationSelector A function that
     * returns an Observable for each value emitted by the source Observable, which
     * is then used to delay the emission of that item on the output Observable
     * until the Observable returned from this function emits a value.
     * @param {Observable} subscriptionDelay An Observable that triggers the
     * subscription to the source Observable once it emits any value.
     * @return {Observable} An Observable that delays the emissions of the source
     * Observable by an amount of time specified by the Observable returned by
     * `delayDurationSelector`.
     * @method delayWhen
     * @owner Observable
     */
    export function delayWhen<T>(this: Observable<T>, delayDurationSelector: (value: T) => Observable<any>, subscriptionDelay?: Observable<any>): Observable<T>;
}
declare module "rxjs/add/operator/delayWhen" {
    import { delayWhen } from "rxjs/operator/delayWhen";
    module "Observable" {
        interface Observable<T> {
            delayWhen: typeof delayWhen;
        }
    }
}
declare module "rxjs/util/Set" {
    export interface ISetCtor {
        new <T>(): ISet<T>;
    }
    export interface ISet<T> {
        add(value: T): void;
        has(value: T): boolean;
        size: number;
        clear(): void;
    }
    export function minimalSetImpl<T>(): ISetCtor;
    export const Set: ISetCtor;
}
declare module "rxjs/operator/distinct" {
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { OuterSubscriber } from "rxjs/OuterSubscriber";
    import { InnerSubscriber } from "rxjs/InnerSubscriber";
    /**
     * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items.
     *
     * If a keySelector function is provided, then it will project each value from the source observable into a new value that it will
     * check for equality with previously projected values. If a keySelector function is not provided, it will use each value from the
     * source observable directly with an equality check against previous values.
     *
     * In JavaScript runtimes that support `Set`, this operator will use a `Set` to improve performance of the distinct value checking.
     *
     * In other runtimes, this operator will use a minimal implementation of `Set` that relies on an `Array` and `indexOf` under the
     * hood, so performance will degrade as more values are checked for distinction. Even in newer browsers, a long-running `distinct`
     * use might result in memory leaks. To help alleviate this in some scenarios, an optional `flushes` parameter is also provided so
     * that the internal `Set` can be "flushed", basically clearing it of values.
     *
     * @example <caption>A simple example with numbers</caption>
     * Observable.of(1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1)
     *   .distinct()
     *   .subscribe(x => console.log(x)); // 1, 2, 3, 4
     *
     * @example <caption>An example using a keySelector function</caption>
     * interface Person {
     *    age: number,
     *    name: string
     * }
     *
     * Observable.of<Person>(
     *     { age: 4, name: 'Foo'},
     *     { age: 7, name: 'Bar'},
     *     { age: 5, name: 'Foo'})
     *     .distinct((p: Person) => p.name)
     *     .subscribe(x => console.log(x));
     *
     * // displays:
     * // { age: 4, name: 'Foo' }
     * // { age: 7, name: 'Bar' }
     *
     * @see {@link distinctUntilChanged}
     * @see {@link distinctUntilKeyChanged}
     *
     * @param {function} [keySelector] Optional function to select which value you want to check as distinct.
     * @param {Observable} [flushes] Optional Observable for flushing the internal HashSet of the operator.
     * @return {Observable} An Observable that emits items from the source Observable with distinct values.
     * @method distinct
     * @owner Observable
     */
    export function distinct<T, K>(this: Observable<T>, keySelector?: (value: T) => K, flushes?: Observable<any>): Observable<T>;
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class DistinctSubscriber<T, K> extends OuterSubscriber<T, T> {
        private keySelector;
        private values;
        constructor(destination: Subscriber<T>, keySelector: (value: T) => K, flushes: Observable<any>);
        notifyNext(outerValue: T, innerValue: T, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, T>): void;
        notifyError(error: any, innerSub: InnerSubscriber<T, T>): void;
        protected _next(value: T): void;
        private _useKeySelector(value);
        private _finalizeNext(key, value);
    }
}
declare module "rxjs/add/operator/distinct" {
    import { distinct } from "rxjs/operator/distinct";
    module "Observable" {
        interface Observable<T> {
            distinct: typeof distinct;
        }
    }
}
declare module "rxjs/operator/distinctUntilChanged" {
    import { Observable } from "rxjs/Observable";
    export function distinctUntilChanged<T>(this: Observable<T>, compare?: (x: T, y: T) => boolean): Observable<T>;
    export function distinctUntilChanged<T, K>(this: Observable<T>, compare: (x: K, y: K) => boolean, keySelector: (x: T) => K): Observable<T>;
}
declare module "rxjs/add/operator/distinctUntilChanged" {
    import { distinctUntilChanged } from "rxjs/operator/distinctUntilChanged";
    module "Observable" {
        interface Observable<T> {
            distinctUntilChanged: typeof distinctUntilChanged;
        }
    }
}
declare module "rxjs/operator/distinctUntilKeyChanged" {
    import { Observable } from "rxjs/Observable";
    export function distinctUntilKeyChanged<T>(this: Observable<T>, key: string): Observable<T>;
    export function distinctUntilKeyChanged<T, K>(this: Observable<T>, key: string, compare: (x: K, y: K) => boolean): Observable<T>;
}
declare module "rxjs/add/operator/distinctUntilKeyChanged" {
    import { distinctUntilKeyChanged } from "rxjs/operator/distinctUntilKeyChanged";
    module "Observable" {
        interface Observable<T> {
            distinctUntilKeyChanged: typeof distinctUntilKeyChanged;
        }
    }
}
declare module "rxjs/operator/do" {
    import { Observable } from "rxjs/Observable";
    import { PartialObserver } from "rxjs/Observer";
    export function _do<T>(this: Observable<T>, next: (x: T) => void, error?: (e: any) => void, complete?: () => void): Observable<T>;
    export function _do<T>(this: Observable<T>, observer: PartialObserver<T>): Observable<T>;
}
declare module "rxjs/add/operator/do" {
    import { _do } from "rxjs/operator/do";
    module "Observable" {
        interface Observable<T> {
            do: typeof _do;
            _do: typeof _do;
        }
    }
}
declare module "rxjs/operator/exhaust" {
    import { Observable } from "rxjs/Observable";
    /**
     * Converts a higher-order Observable into a first-order Observable by dropping
     * inner Observables while the previous inner Observable has not yet completed.
     *
     * <span class="informal">Flattens an Observable-of-Observables by dropping the
     * next inner Observables while the current inner is still executing.</span>
     *
     * <img src="./img/exhaust.png" width="100%">
     *
     * `exhaust` subscribes to an Observable that emits Observables, also known as a
     * higher-order Observable. Each time it observes one of these emitted inner
     * Observables, the output Observable begins emitting the items emitted by that
     * inner Observable. So far, it behaves like {@link mergeAll}. However,
     * `exhaust` ignores every new inner Observable if the previous Observable has
     * not yet completed. Once that one completes, it will accept and flatten the
     * next inner Observable and repeat this process.
     *
     * @example <caption>Run a finite timer for each click, only if there is no currently active timer</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
     * var result = higherOrder.exhaust();
     * result.subscribe(x => console.log(x));
     *
     * @see {@link combineAll}
     * @see {@link concatAll}
     * @see {@link switch}
     * @see {@link mergeAll}
     * @see {@link exhaustMap}
     * @see {@link zipAll}
     *
     * @return {Observable} An Observable that takes a source of Observables and propagates the first observable
     * exclusively until it completes before subscribing to the next.
     * @method exhaust
     * @owner Observable
     */
    export function exhaust<T>(this: Observable<T>): Observable<T>;
}
declare module "rxjs/add/operator/exhaust" {
    import { exhaust } from "rxjs/operator/exhaust";
    module "Observable" {
        interface Observable<T> {
            exhaust: typeof exhaust;
        }
    }
}
declare module "rxjs/operator/exhaustMap" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    export function exhaustMap<T, R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<R>): Observable<R>;
    export function exhaustMap<T, I, R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<I>, resultSelector: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R): Observable<R>;
}
declare module "rxjs/add/operator/exhaustMap" {
    import { exhaustMap } from "rxjs/operator/exhaustMap";
    module "Observable" {
        interface Observable<T> {
            exhaustMap: typeof exhaustMap;
        }
    }
}
declare module "rxjs/operator/expand" {
    import { Observable } from "rxjs/Observable";
    import { IScheduler } from "rxjs/Scheduler";
    import { Operator } from "rxjs/Operator";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    import { OuterSubscriber } from "rxjs/OuterSubscriber";
    import { InnerSubscriber } from "rxjs/InnerSubscriber";
    export function expand<T>(this: Observable<T>, project: (value: T, index: number) => Observable<T>, concurrent?: number, scheduler?: IScheduler): Observable<T>;
    export function expand<T, R>(this: Observable<T>, project: (value: T, index: number) => Observable<R>, concurrent?: number, scheduler?: IScheduler): Observable<R>;
    export class ExpandOperator<T, R> implements Operator<T, R> {
        private project;
        private concurrent;
        private scheduler;
        constructor(project: (value: T, index: number) => Observable<R>, concurrent: number, scheduler: IScheduler);
        call(subscriber: Subscriber<R>, source: any): any;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class ExpandSubscriber<T, R> extends OuterSubscriber<T, R> {
        private project;
        private concurrent;
        private scheduler;
        private index;
        private active;
        private hasCompleted;
        private buffer;
        constructor(destination: Subscriber<R>, project: (value: T, index: number) => Observable<R>, concurrent: number, scheduler: IScheduler);
        private static dispatch<T, R>(arg);
        protected _next(value: any): void;
        private subscribeToProjection(result, value, index);
        protected _complete(): void;
        notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
        notifyComplete(innerSub: Subscription): void;
    }
}
declare module "rxjs/add/operator/expand" {
    import { expand } from "rxjs/operator/expand";
    module "Observable" {
        interface Observable<T> {
            expand: typeof expand;
        }
    }
}
declare module "rxjs/util/ArgumentOutOfRangeError" {
    /**
     * An error thrown when an element was queried at a certain index of an
     * Observable, but no such index or position exists in that sequence.
     *
     * @see {@link elementAt}
     * @see {@link take}
     * @see {@link takeLast}
     *
     * @class ArgumentOutOfRangeError
     */
    export class ArgumentOutOfRangeError extends Error {
        constructor();
    }
}
declare module "rxjs/operator/elementAt" {
    import { Observable } from "rxjs/Observable";
    /**
     * Emits the single value at the specified `index` in a sequence of emissions
     * from the source Observable.
     *
     * <span class="informal">Emits only the i-th value, then completes.</span>
     *
     * <img src="./img/elementAt.png" width="100%">
     *
     * `elementAt` returns an Observable that emits the item at the specified
     * `index` in the source Observable, or a default value if that `index` is out
     * of range and the `default` argument is provided. If the `default` argument is
     * not given and the `index` is out of range, the output Observable will emit an
     * `ArgumentOutOfRangeError` error.
     *
     * @example <caption>Emit only the third click event</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.elementAt(2);
     * result.subscribe(x => console.log(x));
     *
     * // Results in:
     * // click 1 = nothing
     * // click 2 = nothing
     * // click 3 = MouseEvent object logged to console
     *
     * @see {@link first}
     * @see {@link last}
     * @see {@link skip}
     * @see {@link single}
     * @see {@link take}
     *
     * @throws {ArgumentOutOfRangeError} When using `elementAt(i)`, it delivers an
     * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0` or the
     * Observable has completed before emitting the i-th `next` notification.
     *
     * @param {number} index Is the number `i` for the i-th source emission that has
     * happened since the subscription, starting from the number `0`.
     * @param {T} [defaultValue] The default value returned for missing indices.
     * @return {Observable} An Observable that emits a single item, if it is found.
     * Otherwise, will emit the default value if given. If not, then emits an error.
     * @method elementAt
     * @owner Observable
     */
    export function elementAt<T>(this: Observable<T>, index: number, defaultValue?: T): Observable<T>;
}
declare module "rxjs/add/operator/elementAt" {
    import { elementAt } from "rxjs/operator/elementAt";
    module "Observable" {
        interface Observable<T> {
            elementAt: typeof elementAt;
        }
    }
}
declare module "rxjs/operator/filter" {
    import { Observable } from "rxjs/Observable";
    export function filter<T, S extends T>(this: Observable<T>, predicate: (value: T, index: number) => value is S, thisArg?: any): Observable<S>;
    export function filter<T>(this: Observable<T>, predicate: (value: T, index: number) => boolean, thisArg?: any): Observable<T>;
}
declare module "rxjs/add/operator/filter" {
    import { filter } from "rxjs/operator/filter";
    module "Observable" {
        interface Observable<T> {
            filter: typeof filter;
        }
    }
}
declare module "rxjs/operator/finally" {
    import { Observable } from "rxjs/Observable";
    /**
     * Returns an Observable that mirrors the source Observable, but will call a specified function when
     * the source terminates on complete or error.
     * @param {function} callback Function to be called when source terminates.
     * @return {Observable} An Observable that mirrors the source, but will call the specified function on termination.
     * @method finally
     * @owner Observable
     */
    export function _finally<T>(this: Observable<T>, callback: () => void): Observable<T>;
}
declare module "rxjs/add/operator/finally" {
    import { _finally } from "rxjs/operator/finally";
    module "Observable" {
        interface Observable<T> {
            finally: typeof _finally;
            _finally: typeof _finally;
        }
    }
}
declare module "rxjs/operator/find" {
    import { Observable } from "rxjs/Observable";
    import { Operator } from "rxjs/Operator";
    import { Subscriber } from "rxjs/Subscriber";
    export function find<T, S extends T>(this: Observable<T>, predicate: (value: T, index: number) => value is S, thisArg?: any): Observable<S>;
    export function find<T>(this: Observable<T>, predicate: (value: T, index: number) => boolean, thisArg?: any): Observable<T>;
    export class FindValueOperator<T> implements Operator<T, T> {
        private predicate;
        private source;
        private yieldIndex;
        private thisArg;
        constructor(predicate: (value: T, index: number, source: Observable<T>) => boolean, source: Observable<T>, yieldIndex: boolean, thisArg?: any);
        call(observer: Subscriber<T>, source: any): any;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class FindValueSubscriber<T> extends Subscriber<T> {
        private predicate;
        private source;
        private yieldIndex;
        private thisArg;
        private index;
        constructor(destination: Subscriber<T>, predicate: (value: T, index: number, source: Observable<T>) => boolean, source: Observable<T>, yieldIndex: boolean, thisArg?: any);
        private notifyComplete(value);
        protected _next(value: T): void;
        protected _complete(): void;
    }
}
declare module "rxjs/add/operator/find" {
    import { find } from "rxjs/operator/find";
    module "Observable" {
        interface Observable<T> {
            find: typeof find;
        }
    }
}
declare module "rxjs/operator/findIndex" {
    import { Observable } from "rxjs/Observable";
    /**
     * Emits only the index of the first value emitted by the source Observable that
     * meets some condition.
     *
     * <span class="informal">It's like {@link find}, but emits the index of the
     * found value, not the value itself.</span>
     *
     * <img src="./img/findIndex.png" width="100%">
     *
     * `findIndex` searches for the first item in the source Observable that matches
     * the specified condition embodied by the `predicate`, and returns the
     * (zero-based) index of the first occurrence in the source. Unlike
     * {@link first}, the `predicate` is required in `findIndex`, and does not emit
     * an error if a valid value is not found.
     *
     * @example <caption>Emit the index of first click that happens on a DIV element</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.findIndex(ev => ev.target.tagName === 'DIV');
     * result.subscribe(x => console.log(x));
     *
     * @see {@link filter}
     * @see {@link find}
     * @see {@link first}
     * @see {@link take}
     *
     * @param {function(value: T, index: number, source: Observable<T>): boolean} predicate
     * A function called with each item to test for condition matching.
     * @param {any} [thisArg] An optional argument to determine the value of `this`
     * in the `predicate` function.
     * @return {Observable} An Observable of the index of the first item that
     * matches the condition.
     * @method find
     * @owner Observable
     */
    export function findIndex<T>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any): Observable<number>;
}
declare module "rxjs/add/operator/findIndex" {
    import { findIndex } from "rxjs/operator/findIndex";
    module "Observable" {
        interface Observable<T> {
            findIndex: typeof findIndex;
        }
    }
}
declare module "rxjs/util/EmptyError" {
    /**
     * An error thrown when an Observable or a sequence was queried but has no
     * elements.
     *
     * @see {@link first}
     * @see {@link last}
     * @see {@link single}
     *
     * @class EmptyError
     */
    export class EmptyError extends Error {
        constructor();
    }
}
declare module "rxjs/operator/first" {
    import { Observable } from "rxjs/Observable";
    export function first<T, S extends T>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => value is S): Observable<S>;
    export function first<T, S extends T, R>(this: Observable<T>, predicate: (value: T | S, index: number, source: Observable<T>) => value is S, resultSelector: (value: S, index: number) => R, defaultValue?: R): Observable<R>;
    export function first<T, S extends T>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => value is S, resultSelector: void, defaultValue?: S): Observable<S>;
    export function first<T>(this: Observable<T>, predicate?: (value: T, index: number, source: Observable<T>) => boolean): Observable<T>;
    export function first<T, R>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => boolean, resultSelector?: (value: T, index: number) => R, defaultValue?: R): Observable<R>;
    export function first<T>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => boolean, resultSelector: void, defaultValue?: T): Observable<T>;
}
declare module "rxjs/add/operator/first" {
    import { first } from "rxjs/operator/first";
    module "Observable" {
        interface Observable<T> {
            first: typeof first;
        }
    }
}
declare module "rxjs/util/MapPolyfill" {
    export class MapPolyfill {
        size: number;
        private _values;
        private _keys;
        get(key: any): any;
        set(key: any, value: any): this;
        delete(key: any): boolean;
        clear(): void;
        forEach(cb: Function, thisArg: any): void;
    }
}
declare module "rxjs/util/Map" {
    export const Map: any;
}
declare module "rxjs/util/FastMap" {
    export class FastMap {
        private values;
        delete(key: string): boolean;
        set(key: string, value: any): FastMap;
        get(key: string): any;
        forEach(cb: (value: any, key: any) => void, thisArg?: any): void;
        clear(): void;
    }
}
declare module "rxjs/operator/groupBy" {
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    import { Observable } from "rxjs/Observable";
    import { Subject } from "rxjs/Subject";
    export function groupBy<T, K>(this: Observable<T>, keySelector: (value: T) => K): Observable<GroupedObservable<K, T>>;
    export function groupBy<T, K>(this: Observable<T>, keySelector: (value: T) => K, elementSelector: void, durationSelector: (grouped: GroupedObservable<K, T>) => Observable<any>): Observable<GroupedObservable<K, T>>;
    export function groupBy<T, K, R>(this: Observable<T>, keySelector: (value: T) => K, elementSelector?: (value: T) => R, durationSelector?: (grouped: GroupedObservable<K, R>) => Observable<any>): Observable<GroupedObservable<K, R>>;
    export function groupBy<T, K, R>(this: Observable<T>, keySelector: (value: T) => K, elementSelector?: (value: T) => R, durationSelector?: (grouped: GroupedObservable<K, R>) => Observable<any>, subjectSelector?: () => Subject<R>): Observable<GroupedObservable<K, R>>;
    export interface RefCountSubscription {
        count: number;
        unsubscribe: () => void;
        closed: boolean;
        attemptedToUnsubscribe: boolean;
    }
    /**
     * An Observable representing values belonging to the same group represented by
     * a common key. The values emitted by a GroupedObservable come from the source
     * Observable. The common key is available as the field `key` on a
     * GroupedObservable instance.
     *
     * @class GroupedObservable<K, T>
     */
    export class GroupedObservable<K, T> extends Observable<T> {
        key: K;
        private groupSubject;
        private refCountSubscription;
        constructor(key: K, groupSubject: Subject<T>, refCountSubscription?: RefCountSubscription);
        protected _subscribe(subscriber: Subscriber<T>): Subscription;
    }
}
declare module "rxjs/add/operator/groupBy" {
    import { groupBy } from "rxjs/operator/groupBy";
    module "Observable" {
        interface Observable<T> {
            groupBy: typeof groupBy;
        }
    }
}
declare module "rxjs/operator/ignoreElements" {
    import { Observable } from "rxjs/Observable";
    /**
     * Ignores all items emitted by the source Observable and only passes calls of `complete` or `error`.
     *
     * <img src="./img/ignoreElements.png" width="100%">
     *
     * @return {Observable} An empty Observable that only calls `complete`
     * or `error`, based on which one is called by the source Observable.
     * @method ignoreElements
     * @owner Observable
     */
    export function ignoreElements<T>(this: Observable<T>): Observable<T>;
}
declare module "rxjs/add/operator/ignoreElements" {
    import { ignoreElements } from "rxjs/operator/ignoreElements";
    module "Observable" {
        interface Observable<T> {
            ignoreElements: typeof ignoreElements;
        }
    }
}
declare module "rxjs/operator/isEmpty" {
    import { Observable } from "rxjs/Observable";
    /**
     * If the source Observable is empty it returns an Observable that emits true, otherwise it emits false.
     *
     * <img src="./img/isEmpty.png" width="100%">
     *
     * @return {Observable} An Observable that emits a Boolean.
     * @method isEmpty
     * @owner Observable
     */
    export function isEmpty<T>(this: Observable<T>): Observable<boolean>;
}
declare module "rxjs/add/operator/isEmpty" {
    import { isEmpty } from "rxjs/operator/isEmpty";
    module "Observable" {
        interface Observable<T> {
            isEmpty: typeof isEmpty;
        }
    }
}
declare module "rxjs/operator/audit" {
    import { Observable, SubscribableOrPromise } from "rxjs/Observable";
    /**
     * Ignores source values for a duration determined by another Observable, then
     * emits the most recent value from the source Observable, then repeats this
     * process.
     *
     * <span class="informal">It's like {@link auditTime}, but the silencing
     * duration is determined by a second Observable.</span>
     *
     * <img src="./img/audit.png" width="100%">
     *
     * `audit` is similar to `throttle`, but emits the last value from the silenced
     * time window, instead of the first value. `audit` emits the most recent value
     * from the source Observable on the output Observable as soon as its internal
     * timer becomes disabled, and ignores source values while the timer is enabled.
     * Initially, the timer is disabled. As soon as the first source value arrives,
     * the timer is enabled by calling the `durationSelector` function with the
     * source value, which returns the "duration" Observable. When the duration
     * Observable emits a value or completes, the timer is disabled, then the most
     * recent source value is emitted on the output Observable, and this process
     * repeats for the next source value.
     *
     * @example <caption>Emit clicks at a rate of at most one click per second</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.audit(ev => Rx.Observable.interval(1000));
     * result.subscribe(x => console.log(x));
     *
     * @see {@link auditTime}
     * @see {@link debounce}
     * @see {@link delayWhen}
     * @see {@link sample}
     * @see {@link throttle}
     *
     * @param {function(value: T): SubscribableOrPromise} durationSelector A function
     * that receives a value from the source Observable, for computing the silencing
     * duration, returned as an Observable or a Promise.
     * @return {Observable<T>} An Observable that performs rate-limiting of
     * emissions from the source Observable.
     * @method audit
     * @owner Observable
     */
    export function audit<T>(this: Observable<T>, durationSelector: (value: T) => SubscribableOrPromise<any>): Observable<T>;
}
declare module "rxjs/add/operator/audit" {
    import { audit } from "rxjs/operator/audit";
    module "Observable" {
        interface Observable<T> {
            audit: typeof audit;
        }
    }
}
declare module "rxjs/operator/auditTime" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    /**
     * Ignores source values for `duration` milliseconds, then emits the most recent
     * value from the source Observable, then repeats this process.
     *
     * <span class="informal">When it sees a source values, it ignores that plus
     * the next ones for `duration` milliseconds, and then it emits the most recent
     * value from the source.</span>
     *
     * <img src="./img/auditTime.png" width="100%">
     *
     * `auditTime` is similar to `throttleTime`, but emits the last value from the
     * silenced time window, instead of the first value. `auditTime` emits the most
     * recent value from the source Observable on the output Observable as soon as
     * its internal timer becomes disabled, and ignores source values while the
     * timer is enabled. Initially, the timer is disabled. As soon as the first
     * source value arrives, the timer is enabled. After `duration` milliseconds (or
     * the time unit determined internally by the optional `scheduler`) has passed,
     * the timer is disabled, then the most recent source value is emitted on the
     * output Observable, and this process repeats for the next source value.
     * Optionally takes a {@link IScheduler} for managing timers.
     *
     * @example <caption>Emit clicks at a rate of at most one click per second</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.auditTime(1000);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link audit}
     * @see {@link debounceTime}
     * @see {@link delay}
     * @see {@link sampleTime}
     * @see {@link throttleTime}
     *
     * @param {number} duration Time to wait before emitting the most recent source
     * value, measured in milliseconds or the time unit determined internally
     * by the optional `scheduler`.
     * @param {Scheduler} [scheduler=async] The {@link IScheduler} to use for
     * managing the timers that handle the rate-limiting behavior.
     * @return {Observable<T>} An Observable that performs rate-limiting of
     * emissions from the source Observable.
     * @method auditTime
     * @owner Observable
     */
    export function auditTime<T>(this: Observable<T>, duration: number, scheduler?: IScheduler): Observable<T>;
}
declare module "rxjs/add/operator/auditTime" {
    import { auditTime } from "rxjs/operator/auditTime";
    module "Observable" {
        interface Observable<T> {
            auditTime: typeof auditTime;
        }
    }
}
declare module "rxjs/operator/last" {
    import { Observable } from "rxjs/Observable";
    export function last<T, S extends T>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => value is S): Observable<S>;
    export function last<T, S extends T, R>(this: Observable<T>, predicate: (value: T | S, index: number, source: Observable<T>) => value is S, resultSelector: (value: S, index: number) => R, defaultValue?: R): Observable<R>;
    export function last<T, S extends T>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => value is S, resultSelector: void, defaultValue?: S): Observable<S>;
    export function last<T>(this: Observable<T>, predicate?: (value: T, index: number, source: Observable<T>) => boolean): Observable<T>;
    export function last<T, R>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => boolean, resultSelector?: (value: T, index: number) => R, defaultValue?: R): Observable<R>;
    export function last<T>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => boolean, resultSelector: void, defaultValue?: T): Observable<T>;
}
declare module "rxjs/add/operator/last" {
    import { last } from "rxjs/operator/last";
    module "Observable" {
        interface Observable<T> {
            last: typeof last;
        }
    }
}
declare module "rxjs/operator/let" {
    import { Observable } from "rxjs/Observable";
    /**
     * @param func
     * @return {Observable<R>}
     * @method let
     * @owner Observable
     */
    export function letProto<T, R>(this: Observable<T>, func: (selector: Observable<T>) => Observable<R>): Observable<R>;
}
declare module "rxjs/add/operator/let" {
    import { letProto } from "rxjs/operator/let";
    module "Observable" {
        interface Observable<T> {
            let: typeof letProto;
            letBind: typeof letProto;
        }
    }
}
declare module "rxjs/operator/every" {
    import { Observable } from "rxjs/Observable";
    /**
     * Returns an Observable that emits whether or not every item of the source satisfies the condition specified.
     *
     * @example <caption>A simple example emitting true if all elements are less than 5, false otherwise</caption>
     *  Observable.of(1, 2, 3, 4, 5, 6)
     *     .every(x => x < 5)
     *     .subscribe(x => console.log(x)); // -> false
     *
     * @param {function} predicate A function for determining if an item meets a specified condition.
     * @param {any} [thisArg] Optional object to use for `this` in the callback.
     * @return {Observable} An Observable of booleans that determines if all items of the source Observable meet the condition specified.
     * @method every
     * @owner Observable
     */
    export function every<T>(this: Observable<T>, predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any): Observable<boolean>;
}
declare module "rxjs/add/operator/every" {
    import { every } from "rxjs/operator/every";
    module "Observable" {
        interface Observable<T> {
            every: typeof every;
        }
    }
}
declare module "rxjs/add/operator/map" {
    import { map } from "rxjs/operator/map";
    module "Observable" {
        interface Observable<T> {
            map: typeof map;
        }
    }
}
declare module "rxjs/operator/mapTo" {
    import { Observable } from "rxjs/Observable";
    /**
     * Emits the given constant value on the output Observable every time the source
     * Observable emits a value.
     *
     * <span class="informal">Like {@link map}, but it maps every source value to
     * the same output value every time.</span>
     *
     * <img src="./img/mapTo.png" width="100%">
     *
     * Takes a constant `value` as argument, and emits that whenever the source
     * Observable emits a value. In other words, ignores the actual source value,
     * and simply uses the emission moment to know when to emit the given `value`.
     *
     * @example <caption>Map every every click to the string 'Hi'</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var greetings = clicks.mapTo('Hi');
     * greetings.subscribe(x => console.log(x));
     *
     * @see {@link map}
     *
     * @param {any} value The value to map each source value to.
     * @return {Observable} An Observable that emits the given `value` every time
     * the source Observable emits something.
     * @method mapTo
     * @owner Observable
     */
    export function mapTo<T, R>(this: Observable<T>, value: R): Observable<R>;
}
declare module "rxjs/add/operator/mapTo" {
    import { mapTo } from "rxjs/operator/mapTo";
    module "Observable" {
        interface Observable<T> {
            mapTo: typeof mapTo;
        }
    }
}
declare module "rxjs/operator/materialize" {
    import { Observable } from "rxjs/Observable";
    import { Notification } from "rxjs/Notification";
    /**
     * Represents all of the notifications from the source Observable as `next`
     * emissions marked with their original types within {@link Notification}
     * objects.
     *
     * <span class="informal">Wraps `next`, `error` and `complete` emissions in
     * {@link Notification} objects, emitted as `next` on the output Observable.
     * </span>
     *
     * <img src="./img/materialize.png" width="100%">
     *
     * `materialize` returns an Observable that emits a `next` notification for each
     * `next`, `error`, or `complete` emission of the source Observable. When the
     * source Observable emits `complete`, the output Observable will emit `next` as
     * a Notification of type "complete", and then it will emit `complete` as well.
     * When the source Observable emits `error`, the output will emit `next` as a
     * Notification of type "error", and then `complete`.
     *
     * This operator is useful for producing metadata of the source Observable, to
     * be consumed as `next` emissions. Use it in conjunction with
     * {@link dematerialize}.
     *
     * @example <caption>Convert a faulty Observable to an Observable of Notifications</caption>
     * var letters = Rx.Observable.of('a', 'b', 13, 'd');
     * var upperCase = letters.map(x => x.toUpperCase());
     * var materialized = upperCase.materialize();
     * materialized.subscribe(x => console.log(x));
     *
     * // Results in the following:
     * // - Notification {kind: "N", value: "A", error: undefined, hasValue: true}
     * // - Notification {kind: "N", value: "B", error: undefined, hasValue: true}
     * // - Notification {kind: "E", value: undefined, error: TypeError:
     * //   x.toUpperCase is not a function at MapSubscriber.letters.map.x
     * //   [as project] (http://1…, hasValue: false}
     *
     * @see {@link Notification}
     * @see {@link dematerialize}
     *
     * @return {Observable<Notification<T>>} An Observable that emits
     * {@link Notification} objects that wrap the original emissions from the source
     * Observable with metadata.
     * @method materialize
     * @owner Observable
     */
    export function materialize<T>(this: Observable<T>): Observable<Notification<T>>;
}
declare module "rxjs/add/operator/materialize" {
    import { materialize } from "rxjs/operator/materialize";
    module "Observable" {
        interface Observable<T> {
            materialize: typeof materialize;
        }
    }
}
declare module "rxjs/operator/reduce" {
    import { Observable } from "rxjs/Observable";
    import { Operator } from "rxjs/Operator";
    import { Subscriber } from "rxjs/Subscriber";
    export function reduce<T>(this: Observable<T>, accumulator: (acc: T[], value: T, index: number) => T[], seed: T[]): Observable<T[]>;
    export function reduce<T>(this: Observable<T>, accumulator: (acc: T, value: T, index: number) => T, seed?: T): Observable<T>;
    export function reduce<T, R>(this: Observable<T>, accumulator: (acc: R, value: T, index: number) => R, seed: R): Observable<R>;
    export class ReduceOperator<T, R> implements Operator<T, R> {
        private accumulator;
        private seed;
        private hasSeed;
        constructor(accumulator: (acc: R, value: T, index?: number) => R, seed?: R, hasSeed?: boolean);
        call(subscriber: Subscriber<R>, source: any): any;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class ReduceSubscriber<T, R> extends Subscriber<T> {
        private accumulator;
        private hasSeed;
        private index;
        private acc;
        private hasValue;
        constructor(destination: Subscriber<R>, accumulator: (acc: R, value: T, index?: number) => R, seed: R, hasSeed: boolean);
        protected _next(value: T): void;
        private _tryReduce(value);
        protected _complete(): void;
    }
}
declare module "rxjs/operator/max" {
    import { Observable } from "rxjs/Observable";
    /**
     * The Max operator operates on an Observable that emits numbers (or items that can be compared with a provided function),
     * and when source Observable completes it emits a single item: the item with the largest value.
     *
     * <img src="./img/max.png" width="100%">
     *
     * @example <caption>Get the maximal value of a series of numbers</caption>
     * Rx.Observable.of(5, 4, 7, 2, 8)
     *   .max()
     *   .subscribe(x => console.log(x)); // -> 8
     *
     * @example <caption>Use a comparer function to get the maximal item</caption>
     * interface Person {
     *   age: number,
     *   name: string
     * }
     * Observable.of<Person>({age: 7, name: 'Foo'},
     *                       {age: 5, name: 'Bar'},
     *                       {age: 9, name: 'Beer'})
     *           .max<Person>((a: Person, b: Person) => a.age < b.age ? -1 : 1)
     *           .subscribe((x: Person) => console.log(x.name)); // -> 'Beer'
     * }
     *
     * @see {@link min}
     *
     * @param {Function} [comparer] - Optional comparer function that it will use instead of its default to compare the
     * value of two items.
     * @return {Observable} An Observable that emits item with the largest value.
     * @method max
     * @owner Observable
     */
    export function max<T>(this: Observable<T>, comparer?: (x: T, y: T) => number): Observable<T>;
}
declare module "rxjs/add/operator/max" {
    import { max } from "rxjs/operator/max";
    module "Observable" {
        interface Observable<T> {
            max: typeof max;
        }
    }
}
declare module "rxjs/add/operator/merge" {
    import { merge } from "rxjs/operator/merge";
    module "Observable" {
        interface Observable<T> {
            merge: typeof merge;
        }
    }
}
declare module "rxjs/add/operator/mergeAll" {
    import { mergeAll } from "rxjs/operator/mergeAll";
    module "Observable" {
        interface Observable<T> {
            mergeAll: typeof mergeAll;
        }
    }
}
declare module "rxjs/add/operator/mergeMap" {
    import { mergeMap } from "rxjs/operator/mergeMap";
    module "Observable" {
        interface Observable<T> {
            flatMap: typeof mergeMap;
            mergeMap: typeof mergeMap;
        }
    }
}
declare module "rxjs/add/operator/mergeMapTo" {
    import { mergeMapTo } from "rxjs/operator/mergeMapTo";
    module "Observable" {
        interface Observable<T> {
            flatMapTo: typeof mergeMapTo;
            mergeMapTo: typeof mergeMapTo;
        }
    }
}
declare module "rxjs/operator/mergeScan" {
    import { Operator } from "rxjs/Operator";
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    import { OuterSubscriber } from "rxjs/OuterSubscriber";
    import { InnerSubscriber } from "rxjs/InnerSubscriber";
    /**
     * Applies an accumulator function over the source Observable where the
     * accumulator function itself returns an Observable, then each intermediate
     * Observable returned is merged into the output Observable.
     *
     * <span class="informal">It's like {@link scan}, but the Observables returned
     * by the accumulator are merged into the outer Observable.</span>
     *
     * @example <caption>Count the number of click events</caption>
     * const click$ = Rx.Observable.fromEvent(document, 'click');
     * const one$ = click$.mapTo(1);
     * const seed = 0;
     * const count$ = one$.mergeScan((acc, one) => Rx.Observable.of(acc + one), seed);
     * count$.subscribe(x => console.log(x));
     *
     * // Results:
     * 1
     * 2
     * 3
     * 4
     * // ...and so on for each click
     *
     * @param {function(acc: R, value: T): Observable<R>} accumulator
     * The accumulator function called on each source value.
     * @param seed The initial accumulation value.
     * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of
     * input Observables being subscribed to concurrently.
     * @return {Observable<R>} An observable of the accumulated values.
     * @method mergeScan
     * @owner Observable
     */
    export function mergeScan<T, R>(this: Observable<T>, accumulator: (acc: R, value: T) => Observable<R>, seed: R, concurrent?: number): Observable<R>;
    export class MergeScanOperator<T, R> implements Operator<T, R> {
        private accumulator;
        private seed;
        private concurrent;
        constructor(accumulator: (acc: R, value: T) => Observable<R>, seed: R, concurrent: number);
        call(subscriber: Subscriber<R>, source: any): any;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class MergeScanSubscriber<T, R> extends OuterSubscriber<T, R> {
        private accumulator;
        private acc;
        private concurrent;
        private hasValue;
        private hasCompleted;
        private buffer;
        private active;
        protected index: number;
        constructor(destination: Subscriber<R>, accumulator: (acc: R, value: T) => Observable<R>, acc: R, concurrent: number);
        protected _next(value: any): void;
        private _innerSub(ish, value, index);
        protected _complete(): void;
        notifyNext(outerValue: T, innerValue: R, outerIndex: number, innerIndex: number, innerSub: InnerSubscriber<T, R>): void;
        notifyComplete(innerSub: Subscription): void;
    }
}
declare module "rxjs/add/operator/mergeScan" {
    import { mergeScan } from "rxjs/operator/mergeScan";
    module "Observable" {
        interface Observable<T> {
            mergeScan: typeof mergeScan;
        }
    }
}
declare module "rxjs/operator/min" {
    import { Observable } from "rxjs/Observable";
    /**
     * The Min operator operates on an Observable that emits numbers (or items that can be compared with a provided function),
     * and when source Observable completes it emits a single item: the item with the smallest value.
     *
     * <img src="./img/min.png" width="100%">
     *
     * @example <caption>Get the minimal value of a series of numbers</caption>
     * Rx.Observable.of(5, 4, 7, 2, 8)
     *   .min()
     *   .subscribe(x => console.log(x)); // -> 2
     *
     * @example <caption>Use a comparer function to get the minimal item</caption>
     * interface Person {
     *   age: number,
     *   name: string
     * }
     * Observable.of<Person>({age: 7, name: 'Foo'},
     *                       {age: 5, name: 'Bar'},
     *                       {age: 9, name: 'Beer'})
     *           .min<Person>( (a: Person, b: Person) => a.age < b.age ? -1 : 1)
     *           .subscribe((x: Person) => console.log(x.name)); // -> 'Bar'
     * }
     *
     * @see {@link max}
     *
     * @param {Function} [comparer] - Optional comparer function that it will use instead of its default to compare the
     * value of two items.
     * @return {Observable<R>} An Observable that emits item with the smallest value.
     * @method min
     * @owner Observable
     */
    export function min<T>(this: Observable<T>, comparer?: (x: T, y: T) => number): Observable<T>;
}
declare module "rxjs/add/operator/min" {
    import { min } from "rxjs/operator/min";
    module "Observable" {
        interface Observable<T> {
            min: typeof min;
        }
    }
}
declare module "rxjs/observable/ConnectableObservable" {
    import { Subject } from "rxjs/Subject";
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    /**
     * @class ConnectableObservable<T>
     */
    export class ConnectableObservable<T> extends Observable<T> {
        protected source: Observable<T>;
        protected subjectFactory: () => Subject<T>;
        protected _subject: Subject<T>;
        protected _refCount: number;
        protected _connection: Subscription;
        constructor(source: Observable<T>, subjectFactory: () => Subject<T>);
        protected _subscribe(subscriber: Subscriber<T>): Subscription;
        protected getSubject(): Subject<T>;
        connect(): Subscription;
        refCount(): Observable<T>;
    }
    export const connectableObservableDescriptor: PropertyDescriptorMap;
}
declare module "rxjs/operator/multicast" {
    import { Subject } from "rxjs/Subject";
    import { Operator } from "rxjs/Operator";
    import { Subscriber } from "rxjs/Subscriber";
    import { Observable } from "rxjs/Observable";
    import { ConnectableObservable } from "rxjs/observable/ConnectableObservable";
    export function multicast<T>(this: Observable<T>, subjectOrSubjectFactory: factoryOrValue<Subject<T>>): ConnectableObservable<T>;
    export function multicast<T>(SubjectFactory: (this: Observable<T>) => Subject<T>, selector?: selector<T>): Observable<T>;
    export type factoryOrValue<T> = T | (() => T);
    export type selector<T> = (source: Observable<T>) => Observable<T>;
    export class MulticastOperator<T> implements Operator<T, T> {
        private subjectFactory;
        private selector;
        constructor(subjectFactory: () => Subject<T>, selector: (source: Observable<T>) => Observable<T>);
        call(subscriber: Subscriber<T>, source: any): any;
    }
}
declare module "rxjs/add/operator/multicast" {
    import { multicast } from "rxjs/operator/multicast";
    module "Observable" {
        interface Observable<T> {
            multicast: typeof multicast;
        }
    }
}
declare module "rxjs/add/operator/observeOn" {
    import { observeOn } from "rxjs/operator/observeOn";
    module "Observable" {
        interface Observable<T> {
            observeOn: typeof observeOn;
        }
    }
}
declare module "rxjs/add/operator/onErrorResumeNext" {
    import { onErrorResumeNext } from "rxjs/operator/onErrorResumeNext";
    module "Observable" {
        interface Observable<T> {
            onErrorResumeNext: typeof onErrorResumeNext;
        }
    }
}
declare module "rxjs/operator/pairwise" {
    import { Observable } from "rxjs/Observable";
    /**
     * Groups pairs of consecutive emissions together and emits them as an array of
     * two values.
     *
     * <span class="informal">Puts the current value and previous value together as
     * an array, and emits that.</span>
     *
     * <img src="./img/pairwise.png" width="100%">
     *
     * The Nth emission from the source Observable will cause the output Observable
     * to emit an array [(N-1)th, Nth] of the previous and the current value, as a
     * pair. For this reason, `pairwise` emits on the second and subsequent
     * emissions from the source Observable, but not on the first emission, because
     * there is no previous value in that case.
     *
     * @example <caption>On every click (starting from the second), emit the relative distance to the previous click</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var pairs = clicks.pairwise();
     * var distance = pairs.map(pair => {
     *   var x0 = pair[0].clientX;
     *   var y0 = pair[0].clientY;
     *   var x1 = pair[1].clientX;
     *   var y1 = pair[1].clientY;
     *   return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
     * });
     * distance.subscribe(x => console.log(x));
     *
     * @see {@link buffer}
     * @see {@link bufferCount}
     *
     * @return {Observable<Array<T>>} An Observable of pairs (as arrays) of
     * consecutive values from the source Observable.
     * @method pairwise
     * @owner Observable
     */
    export function pairwise<T>(this: Observable<T>): Observable<[T, T]>;
}
declare module "rxjs/add/operator/pairwise" {
    import { pairwise } from "rxjs/operator/pairwise";
    module "Observable" {
        interface Observable<T> {
            pairwise: typeof pairwise;
        }
    }
}
declare module "rxjs/util/not" {
    export function not(pred: Function, thisArg: any): Function;
}
declare module "rxjs/operator/partition" {
    import { Observable } from "rxjs/Observable";
    /**
     * Splits the source Observable into two, one with values that satisfy a
     * predicate, and another with values that don't satisfy the predicate.
     *
     * <span class="informal">It's like {@link filter}, but returns two Observables:
     * one like the output of {@link filter}, and the other with values that did not
     * pass the condition.</span>
     *
     * <img src="./img/partition.png" width="100%">
     *
     * `partition` outputs an array with two Observables that partition the values
     * from the source Observable through the given `predicate` function. The first
     * Observable in that array emits source values for which the predicate argument
     * returns true. The second Observable emits source values for which the
     * predicate returns false. The first behaves like {@link filter} and the second
     * behaves like {@link filter} with the predicate negated.
     *
     * @example <caption>Partition click events into those on DIV elements and those elsewhere</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var parts = clicks.partition(ev => ev.target.tagName === 'DIV');
     * var clicksOnDivs = parts[0];
     * var clicksElsewhere = parts[1];
     * clicksOnDivs.subscribe(x => console.log('DIV clicked: ', x));
     * clicksElsewhere.subscribe(x => console.log('Other clicked: ', x));
     *
     * @see {@link filter}
     *
     * @param {function(value: T, index: number): boolean} predicate A function that
     * evaluates each value emitted by the source Observable. If it returns `true`,
     * the value is emitted on the first Observable in the returned array, if
     * `false` the value is emitted on the second Observable in the array. The
     * `index` parameter is the number `i` for the i-th source emission that has
     * happened since the subscription, starting from the number `0`.
     * @param {any} [thisArg] An optional argument to determine the value of `this`
     * in the `predicate` function.
     * @return {[Observable<T>, Observable<T>]} An array with two Observables: one
     * with values that passed the predicate, and another with values that did not
     * pass the predicate.
     * @method partition
     * @owner Observable
     */
    export function partition<T>(this: Observable<T>, predicate: (value: T) => boolean, thisArg?: any): [Observable<T>, Observable<T>];
}
declare module "rxjs/add/operator/partition" {
    import { partition } from "rxjs/operator/partition";
    module "Observable" {
        interface Observable<T> {
            partition: typeof partition;
        }
    }
}
declare module "rxjs/operator/pluck" {
    import { Observable } from "rxjs/Observable";
    /**
     * Maps each source value (an object) to its specified nested property.
     *
     * <span class="informal">Like {@link map}, but meant only for picking one of
     * the nested properties of every emitted object.</span>
     *
     * <img src="./img/pluck.png" width="100%">
     *
     * Given a list of strings describing a path to an object property, retrieves
     * the value of a specified nested property from all values in the source
     * Observable. If a property can't be resolved, it will return `undefined` for
     * that value.
     *
     * @example <caption>Map every every click to the tagName of the clicked target element</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var tagNames = clicks.pluck('target', 'tagName');
     * tagNames.subscribe(x => console.log(x));
     *
     * @see {@link map}
     *
     * @param {...string} properties The nested properties to pluck from each source
     * value (an object).
     * @return {Observable} A new Observable of property values from the source values.
     * @method pluck
     * @owner Observable
     */
    export function pluck<T, R>(this: Observable<T>, ...properties: string[]): Observable<R>;
}
declare module "rxjs/add/operator/pluck" {
    import { pluck } from "rxjs/operator/pluck";
    module "Observable" {
        interface Observable<T> {
            pluck: typeof pluck;
        }
    }
}
declare module "rxjs/operator/publish" {
    import { Observable } from "rxjs/Observable";
    import { ConnectableObservable } from "rxjs/observable/ConnectableObservable";
    export function publish<T>(this: Observable<T>): ConnectableObservable<T>;
    export function publish<T>(this: Observable<T>, selector: selector<T>): Observable<T>;
    export type selector<T> = (source: Observable<T>) => Observable<T>;
}
declare module "rxjs/add/operator/publish" {
    import { publish } from "rxjs/operator/publish";
    module "Observable" {
        interface Observable<T> {
            publish: typeof publish;
        }
    }
}
declare module "rxjs/BehaviorSubject" {
    import { Subject } from "rxjs/Subject";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    /**
     * @class BehaviorSubject<T>
     */
    export class BehaviorSubject<T> extends Subject<T> {
        private _value;
        constructor(_value: T);
        readonly value: T;
        protected _subscribe(subscriber: Subscriber<T>): Subscription;
        getValue(): T;
        next(value: T): void;
    }
}
declare module "rxjs/operator/publishBehavior" {
    import { Observable } from "rxjs/Observable";
    import { ConnectableObservable } from "rxjs/observable/ConnectableObservable";
    /**
     * @param value
     * @return {ConnectableObservable<T>}
     * @method publishBehavior
     * @owner Observable
     */
    export function publishBehavior<T>(this: Observable<T>, value: T): ConnectableObservable<T>;
}
declare module "rxjs/add/operator/publishBehavior" {
    import { publishBehavior } from "rxjs/operator/publishBehavior";
    module "Observable" {
        interface Observable<T> {
            publishBehavior: typeof publishBehavior;
        }
    }
}
declare module "rxjs/operator/publishReplay" {
    import { Observable } from "rxjs/Observable";
    import { IScheduler } from "rxjs/Scheduler";
    import { ConnectableObservable } from "rxjs/observable/ConnectableObservable";
    /**
     * @param bufferSize
     * @param windowTime
     * @param scheduler
     * @return {ConnectableObservable<T>}
     * @method publishReplay
     * @owner Observable
     */
    export function publishReplay<T>(this: Observable<T>, bufferSize?: number, windowTime?: number, scheduler?: IScheduler): ConnectableObservable<T>;
}
declare module "rxjs/add/operator/publishReplay" {
    import { publishReplay } from "rxjs/operator/publishReplay";
    module "Observable" {
        interface Observable<T> {
            publishReplay: typeof publishReplay;
        }
    }
}
declare module "rxjs/operator/publishLast" {
    import { Observable } from "rxjs/Observable";
    import { ConnectableObservable } from "rxjs/observable/ConnectableObservable";
    /**
     * @return {ConnectableObservable<T>}
     * @method publishLast
     * @owner Observable
     */
    export function publishLast<T>(this: Observable<T>): ConnectableObservable<T>;
}
declare module "rxjs/add/operator/publishLast" {
    import { publishLast } from "rxjs/operator/publishLast";
    module "Observable" {
        interface Observable<T> {
            publishLast: typeof publishLast;
        }
    }
}
declare module "rxjs/add/operator/race" {
    import { race } from "rxjs/operator/race";
    module "Observable" {
        interface Observable<T> {
            race: typeof race;
        }
    }
}
declare module "rxjs/add/operator/reduce" {
    import { reduce } from "rxjs/operator/reduce";
    module "Observable" {
        interface Observable<T> {
            reduce: typeof reduce;
        }
    }
}
declare module "rxjs/operator/repeat" {
    import { Observable } from "rxjs/Observable";
    /**
     * Returns an Observable that repeats the stream of items emitted by the source Observable at most count times.
     *
     * <img src="./img/repeat.png" width="100%">
     *
     * @param {number} [count] The number of times the source Observable items are repeated, a count of 0 will yield
     * an empty Observable.
     * @return {Observable} An Observable that repeats the stream of items emitted by the source Observable at most
     * count times.
     * @method repeat
     * @owner Observable
     */
    export function repeat<T>(this: Observable<T>, count?: number): Observable<T>;
}
declare module "rxjs/add/operator/repeat" {
    import { repeat } from "rxjs/operator/repeat";
    module "Observable" {
        interface Observable<T> {
            repeat: typeof repeat;
        }
    }
}
declare module "rxjs/operator/repeatWhen" {
    import { Observable } from "rxjs/Observable";
    /**
     * Returns an Observable that mirrors the source Observable with the exception of a `complete`. If the source
     * Observable calls `complete`, this method will emit to the Observable returned from `notifier`. If that Observable
     * calls `complete` or `error`, then this method will call `complete` or `error` on the child subscription. Otherwise
     * this method will resubscribe to the source Observable.
     *
     * <img src="./img/repeatWhen.png" width="100%">
     *
     * @param {function(notifications: Observable): Observable} notifier - Receives an Observable of notifications with
     * which a user can `complete` or `error`, aborting the repetition.
     * @return {Observable} The source Observable modified with repeat logic.
     * @method repeatWhen
     * @owner Observable
     */
    export function repeatWhen<T>(this: Observable<T>, notifier: (notifications: Observable<any>) => Observable<any>): Observable<T>;
}
declare module "rxjs/add/operator/repeatWhen" {
    import { repeatWhen } from "rxjs/operator/repeatWhen";
    module "Observable" {
        interface Observable<T> {
            repeatWhen: typeof repeatWhen;
        }
    }
}
declare module "rxjs/operator/retry" {
    import { Observable } from "rxjs/Observable";
    /**
     * Returns an Observable that mirrors the source Observable with the exception of an `error`. If the source Observable
     * calls `error`, this method will resubscribe to the source Observable for a maximum of `count` resubscriptions (given
     * as a number parameter) rather than propagating the `error` call.
     *
     * <img src="./img/retry.png" width="100%">
     *
     * Any and all items emitted by the source Observable will be emitted by the resulting Observable, even those emitted
     * during failed subscriptions. For example, if an Observable fails at first but emits [1, 2] then succeeds the second
     * time and emits: [1, 2, 3, 4, 5] then the complete stream of emissions and notifications
     * would be: [1, 2, 1, 2, 3, 4, 5, `complete`].
     * @param {number} count - Number of retry attempts before failing.
     * @return {Observable} The source Observable modified with the retry logic.
     * @method retry
     * @owner Observable
     */
    export function retry<T>(this: Observable<T>, count?: number): Observable<T>;
}
declare module "rxjs/add/operator/retry" {
    import { retry } from "rxjs/operator/retry";
    module "Observable" {
        interface Observable<T> {
            retry: typeof retry;
        }
    }
}
declare module "rxjs/operator/retryWhen" {
    import { Observable } from "rxjs/Observable";
    /**
     * Returns an Observable that mirrors the source Observable with the exception of an `error`. If the source Observable
     * calls `error`, this method will emit the Throwable that caused the error to the Observable returned from `notifier`.
     * If that Observable calls `complete` or `error` then this method will call `complete` or `error` on the child
     * subscription. Otherwise this method will resubscribe to the source Observable.
     *
     * <img src="./img/retryWhen.png" width="100%">
     *
     * @param {function(errors: Observable): Observable} notifier - Receives an Observable of notifications with which a
     * user can `complete` or `error`, aborting the retry.
     * @return {Observable} The source Observable modified with retry logic.
     * @method retryWhen
     * @owner Observable
     */
    export function retryWhen<T>(this: Observable<T>, notifier: (errors: Observable<any>) => Observable<any>): Observable<T>;
}
declare module "rxjs/add/operator/retryWhen" {
    import { retryWhen } from "rxjs/operator/retryWhen";
    module "Observable" {
        interface Observable<T> {
            retryWhen: typeof retryWhen;
        }
    }
}
declare module "rxjs/operator/sample" {
    import { Observable } from "rxjs/Observable";
    /**
     * Emits the most recently emitted value from the source Observable whenever
     * another Observable, the `notifier`, emits.
     *
     * <span class="informal">It's like {@link sampleTime}, but samples whenever
     * the `notifier` Observable emits something.</span>
     *
     * <img src="./img/sample.png" width="100%">
     *
     * Whenever the `notifier` Observable emits a value or completes, `sample`
     * looks at the source Observable and emits whichever value it has most recently
     * emitted since the previous sampling, unless the source has not emitted
     * anything since the previous sampling. The `notifier` is subscribed to as soon
     * as the output Observable is subscribed.
     *
     * @example <caption>On every click, sample the most recent "seconds" timer</caption>
     * var seconds = Rx.Observable.interval(1000);
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = seconds.sample(clicks);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link audit}
     * @see {@link debounce}
     * @see {@link sampleTime}
     * @see {@link throttle}
     *
     * @param {Observable<any>} notifier The Observable to use for sampling the
     * source Observable.
     * @return {Observable<T>} An Observable that emits the results of sampling the
     * values emitted by the source Observable whenever the notifier Observable
     * emits value or completes.
     * @method sample
     * @owner Observable
     */
    export function sample<T>(this: Observable<T>, notifier: Observable<any>): Observable<T>;
}
declare module "rxjs/add/operator/sample" {
    import { sample } from "rxjs/operator/sample";
    module "Observable" {
        interface Observable<T> {
            sample: typeof sample;
        }
    }
}
declare module "rxjs/operator/sampleTime" {
    import { Observable } from "rxjs/Observable";
    import { IScheduler } from "rxjs/Scheduler";
    /**
     * Emits the most recently emitted value from the source Observable within
     * periodic time intervals.
     *
     * <span class="informal">Samples the source Observable at periodic time
     * intervals, emitting what it samples.</span>
     *
     * <img src="./img/sampleTime.png" width="100%">
     *
     * `sampleTime` periodically looks at the source Observable and emits whichever
     * value it has most recently emitted since the previous sampling, unless the
     * source has not emitted anything since the previous sampling. The sampling
     * happens periodically in time every `period` milliseconds (or the time unit
     * defined by the optional `scheduler` argument). The sampling starts as soon as
     * the output Observable is subscribed.
     *
     * @example <caption>Every second, emit the most recent click at most once</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.sampleTime(1000);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link auditTime}
     * @see {@link debounceTime}
     * @see {@link delay}
     * @see {@link sample}
     * @see {@link throttleTime}
     *
     * @param {number} period The sampling period expressed in milliseconds or the
     * time unit determined internally by the optional `scheduler`.
     * @param {Scheduler} [scheduler=async] The {@link IScheduler} to use for
     * managing the timers that handle the sampling.
     * @return {Observable<T>} An Observable that emits the results of sampling the
     * values emitted by the source Observable at the specified time interval.
     * @method sampleTime
     * @owner Observable
     */
    export function sampleTime<T>(this: Observable<T>, period: number, scheduler?: IScheduler): Observable<T>;
}
declare module "rxjs/add/operator/sampleTime" {
    import { sampleTime } from "rxjs/operator/sampleTime";
    module "Observable" {
        interface Observable<T> {
            sampleTime: typeof sampleTime;
        }
    }
}
declare module "rxjs/operator/scan" {
    import { Observable } from "rxjs/Observable";
    export function scan<T>(this: Observable<T>, accumulator: (acc: T, value: T, index: number) => T, seed?: T): Observable<T>;
    export function scan<T>(this: Observable<T>, accumulator: (acc: T[], value: T, index: number) => T[], seed?: T[]): Observable<T[]>;
    export function scan<T, R>(this: Observable<T>, accumulator: (acc: R, value: T, index: number) => R, seed?: R): Observable<R>;
}
declare module "rxjs/add/operator/scan" {
    import { scan } from "rxjs/operator/scan";
    module "Observable" {
        interface Observable<T> {
            scan: typeof scan;
        }
    }
}
declare module "rxjs/operator/sequenceEqual" {
    import { Operator } from "rxjs/Operator";
    import { Observer } from "rxjs/Observer";
    import { Observable } from "rxjs/Observable";
    import { Subscriber } from "rxjs/Subscriber";
    /**
     * Compares all values of two observables in sequence using an optional comparor function
     * and returns an observable of a single boolean value representing whether or not the two sequences
     * are equal.
     *
     * <span class="informal">Checks to see of all values emitted by both observables are equal, in order.</span>
     *
     * <img src="./img/sequenceEqual.png" width="100%">
     *
     * `sequenceEqual` subscribes to two observables and buffers incoming values from each observable. Whenever either
     * observable emits a value, the value is buffered and the buffers are shifted and compared from the bottom
     * up; If any value pair doesn't match, the returned observable will emit `false` and complete. If one of the
     * observables completes, the operator will wait for the other observable to complete; If the other
     * observable emits before completing, the returned observable will emit `false` and complete. If one observable never
     * completes or emits after the other complets, the returned observable will never complete.
     *
     * @example <caption>figure out if the Konami code matches</caption>
     * var code = Rx.Observable.from([
     *  "ArrowUp",
     *  "ArrowUp",
     *  "ArrowDown",
     *  "ArrowDown",
     *  "ArrowLeft",
     *  "ArrowRight",
     *  "ArrowLeft",
     *  "ArrowRight",
     *  "KeyB",
     *  "KeyA",
     *  "Enter" // no start key, clearly.
     * ]);
     *
     * var keys = Rx.Observable.fromEvent(document, 'keyup')
     *  .map(e => e.code);
     * var matches = keys.bufferCount(11, 1)
     *  .mergeMap(
     *    last11 =>
     *      Rx.Observable.from(last11)
     *        .sequenceEqual(code)
     *   );
     * matches.subscribe(matched => console.log('Successful cheat at Contra? ', matched));
     *
     * @see {@link combineLatest}
     * @see {@link zip}
     * @see {@link withLatestFrom}
     *
     * @param {Observable} compareTo The observable sequence to compare the source sequence to.
     * @param {function} [comparor] An optional function to compare each value pair
     * @return {Observable} An Observable of a single boolean value representing whether or not
     * the values emitted by both observables were equal in sequence.
     * @method sequenceEqual
     * @owner Observable
     */
    export function sequenceEqual<T>(this: Observable<T>, compareTo: Observable<T>, comparor?: (a: T, b: T) => boolean): Observable<boolean>;
    export class SequenceEqualOperator<T> implements Operator<T, boolean> {
        private compareTo;
        private comparor;
        constructor(compareTo: Observable<T>, comparor: (a: T, b: T) => boolean);
        call(subscriber: Subscriber<boolean>, source: any): any;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class SequenceEqualSubscriber<T, R> extends Subscriber<T> {
        private compareTo;
        private comparor;
        private _a;
        private _b;
        private _oneComplete;
        constructor(destination: Observer<R>, compareTo: Observable<T>, comparor: (a: T, b: T) => boolean);
        protected _next(value: T): void;
        _complete(): void;
        checkValues(): void;
        emit(value: boolean): void;
        nextB(value: T): void;
    }
}
declare module "rxjs/add/operator/sequenceEqual" {
    import { sequenceEqual } from "rxjs/operator/sequenceEqual";
    module "Observable" {
        interface Observable<T> {
            sequenceEqual: typeof sequenceEqual;
        }
    }
}
declare module "rxjs/operator/share" {
    import { Observable } from "rxjs/Observable";
    /**
     * Returns a new Observable that multicasts (shares) the original Observable. As long as there is at least one
     * Subscriber this Observable will be subscribed and emitting data. When all subscribers have unsubscribed it will
     * unsubscribe from the source Observable. Because the Observable is multicasting it makes the stream `hot`.
     * This is an alias for .publish().refCount().
     *
     * <img src="./img/share.png" width="100%">
     *
     * @return {Observable<T>} An Observable that upon connection causes the source Observable to emit items to its Observers.
     * @method share
     * @owner Observable
     */
    export function share<T>(this: Observable<T>): Observable<T>;
}
declare module "rxjs/add/operator/share" {
    import { share } from "rxjs/operator/share";
    module "Observable" {
        interface Observable<T> {
            share: typeof share;
        }
    }
}
declare module "rxjs/operator/single" {
    import { Observable } from "rxjs/Observable";
    /**
     * Returns an Observable that emits the single item emitted by the source Observable that matches a specified
     * predicate, if that Observable emits one such item. If the source Observable emits more than one such item or no
     * such items, notify of an IllegalArgumentException or NoSuchElementException respectively.
     *
     * <img src="./img/single.png" width="100%">
     *
     * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
     * callback if the Observable completes before any `next` notification was sent.
     * @param {Function} predicate - A predicate function to evaluate items emitted by the source Observable.
     * @return {Observable<T>} An Observable that emits the single item emitted by the source Observable that matches
     * the predicate.
     .
     * @method single
     * @owner Observable
     */
    export function single<T>(this: Observable<T>, predicate?: (value: T, index: number, source: Observable<T>) => boolean): Observable<T>;
}
declare module "rxjs/add/operator/single" {
    import { single } from "rxjs/operator/single";
    module "Observable" {
        interface Observable<T> {
            single: typeof single;
        }
    }
}
declare module "rxjs/operator/skip" {
    import { Observable } from "rxjs/Observable";
    /**
     * Returns an Observable that skips the first `count` items emitted by the source Observable.
     *
     * <img src="./img/skip.png" width="100%">
     *
     * @param {Number} count - The number of times, items emitted by source Observable should be skipped.
     * @return {Observable} An Observable that skips values emitted by the source Observable.
     *
     * @method skip
     * @owner Observable
     */
    export function skip<T>(this: Observable<T>, count: number): Observable<T>;
}
declare module "rxjs/add/operator/skip" {
    import { skip } from "rxjs/operator/skip";
    module "Observable" {
        interface Observable<T> {
            skip: typeof skip;
        }
    }
}
declare module "rxjs/operator/skipUntil" {
    import { Observable } from "rxjs/Observable";
    /**
     * Returns an Observable that skips items emitted by the source Observable until a second Observable emits an item.
     *
     * <img src="./img/skipUntil.png" width="100%">
     *
     * @param {Observable} notifier - The second Observable that has to emit an item before the source Observable's elements begin to
     * be mirrored by the resulting Observable.
     * @return {Observable<T>} An Observable that skips items from the source Observable until the second Observable emits
     * an item, then emits the remaining items.
     * @method skipUntil
     * @owner Observable
     */
    export function skipUntil<T>(this: Observable<T>, notifier: Observable<any>): Observable<T>;
}
declare module "rxjs/add/operator/skipUntil" {
    import { skipUntil } from "rxjs/operator/skipUntil";
    module "Observable" {
        interface Observable<T> {
            skipUntil: typeof skipUntil;
        }
    }
}
declare module "rxjs/operator/skipWhile" {
    import { Observable } from "rxjs/Observable";
    /**
     * Returns an Observable that skips all items emitted by the source Observable as long as a specified condition holds
     * true, but emits all further source items as soon as the condition becomes false.
     *
     * <img src="./img/skipWhile.png" width="100%">
     *
     * @param {Function} predicate - A function to test each item emitted from the source Observable.
     * @return {Observable<T>} An Observable that begins emitting items emitted by the source Observable when the
     * specified predicate becomes false.
     * @method skipWhile
     * @owner Observable
     */
    export function skipWhile<T>(this: Observable<T>, predicate: (value: T, index: number) => boolean): Observable<T>;
}
declare module "rxjs/add/operator/skipWhile" {
    import { skipWhile } from "rxjs/operator/skipWhile";
    module "Observable" {
        interface Observable<T> {
            skipWhile: typeof skipWhile;
        }
    }
}
declare module "rxjs/operator/startWith" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    export function startWith<T>(this: Observable<T>, v1: T, scheduler?: IScheduler): Observable<T>;
    export function startWith<T>(this: Observable<T>, v1: T, v2: T, scheduler?: IScheduler): Observable<T>;
    export function startWith<T>(this: Observable<T>, v1: T, v2: T, v3: T, scheduler?: IScheduler): Observable<T>;
    export function startWith<T>(this: Observable<T>, v1: T, v2: T, v3: T, v4: T, scheduler?: IScheduler): Observable<T>;
    export function startWith<T>(this: Observable<T>, v1: T, v2: T, v3: T, v4: T, v5: T, scheduler?: IScheduler): Observable<T>;
    export function startWith<T>(this: Observable<T>, v1: T, v2: T, v3: T, v4: T, v5: T, v6: T, scheduler?: IScheduler): Observable<T>;
    export function startWith<T>(this: Observable<T>, ...array: Array<T | IScheduler>): Observable<T>;
}
declare module "rxjs/add/operator/startWith" {
    import { startWith } from "rxjs/operator/startWith";
    module "Observable" {
        interface Observable<T> {
            startWith: typeof startWith;
        }
    }
}
declare module "rxjs/util/Immediate" {
    export class ImmediateDefinition {
        private root;
        setImmediate: (cb: () => void) => number;
        clearImmediate: (handle: number) => void;
        private identify(o);
        tasksByHandle: any;
        nextHandle: number;
        currentlyRunningATask: boolean;
        constructor(root: any);
        canUseProcessNextTick(): boolean;
        canUseMessageChannel(): boolean;
        canUseReadyStateChange(): boolean;
        canUsePostMessage(): boolean;
        partiallyApplied(handler: any, ...args: any[]): () => void;
        addFromSetImmediateArguments(args: any[]): number;
        createProcessNextTickSetImmediate(): () => any;
        createPostMessageSetImmediate(): () => any;
        runIfPresent(handle: any): void;
        createMessageChannelSetImmediate(): () => any;
        createReadyStateChangeSetImmediate(): () => any;
        createSetTimeoutSetImmediate(): () => any;
    }
    export const Immediate: ImmediateDefinition;
}
declare module "rxjs/scheduler/AsapScheduler" {
    import { AsyncAction } from "rxjs/scheduler/AsyncAction";
    import { AsyncScheduler } from "rxjs/scheduler/AsyncScheduler";
    export class AsapScheduler extends AsyncScheduler {
        flush(action?: AsyncAction<any>): void;
    }
}
declare module "rxjs/scheduler/AsapAction" {
    import { AsyncAction } from "rxjs/scheduler/AsyncAction";
    import { AsapScheduler } from "rxjs/scheduler/AsapScheduler";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class AsapAction<T> extends AsyncAction<T> {
        protected scheduler: AsapScheduler;
        protected work: (this: AsapAction<T>, state?: T) => void;
        constructor(scheduler: AsapScheduler, work: (this: AsapAction<T>, state?: T) => void);
        protected requestAsyncId(scheduler: AsapScheduler, id?: any, delay?: number): any;
        protected recycleAsyncId(scheduler: AsapScheduler, id?: any, delay?: number): any;
    }
}
declare module "rxjs/scheduler/asap" {
    import { AsapScheduler } from "rxjs/scheduler/AsapScheduler";
    /**
     *
     * Asap Scheduler
     *
     * <span class="informal">Perform task as fast as it can be performed asynchronously</span>
     *
     * `asap` scheduler behaves the same as {@link async} scheduler when you use it to delay task
     * in time. If however you set delay to `0`, `asap` will wait for current synchronously executing
     * code to end and then it will try to execute given task as fast as possible.
     *
     * `asap` scheduler will do its best to minimize time between end of currently executing code
     * and start of scheduled task. This makes it best candidate for performing so called "deferring".
     * Traditionally this was achieved by calling `setTimeout(deferredTask, 0)`, but that technique involves
     * some (although minimal) unwanted delay.
     *
     * Note that using `asap` scheduler does not necessarily mean that your task will be first to process
     * after currently executing code. In particular, if some task was also scheduled with `asap` before,
     * that task will execute first. That being said, if you need to schedule task asynchronously, but
     * as soon as possible, `asap` scheduler is your best bet.
     *
     * @example <caption>Compare async and asap scheduler</caption>
     *
     * Rx.Scheduler.async.schedule(() => console.log('async')); // scheduling 'async' first...
     * Rx.Scheduler.asap.schedule(() => console.log('asap'));
     *
     * // Logs:
     * // "asap"
     * // "async"
     * // ... but 'asap' goes first!
     *
     * @static true
     * @name asap
     * @owner Scheduler
     */
    export const asap: AsapScheduler;
}
declare module "rxjs/observable/SubscribeOnObservable" {
    import { Action } from "rxjs/scheduler/Action";
    import { IScheduler } from "rxjs/Scheduler";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    import { Observable } from "rxjs/Observable";
    export interface DispatchArg<T> {
        source: Observable<T>;
        subscriber: Subscriber<T>;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @extends {Ignored}
     * @hide true
     */
    export class SubscribeOnObservable<T> extends Observable<T> {
        source: Observable<T>;
        private delayTime;
        private scheduler;
        static create<T>(source: Observable<T>, delay?: number, scheduler?: IScheduler): Observable<T>;
        static dispatch<T>(this: Action<T>, arg: DispatchArg<T>): Subscription;
        constructor(source: Observable<T>, delayTime?: number, scheduler?: IScheduler);
        protected _subscribe(subscriber: Subscriber<T>): Subscription;
    }
}
declare module "rxjs/operator/subscribeOn" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    /**
     * Asynchronously subscribes Observers to this Observable on the specified IScheduler.
     *
     * <img src="./img/subscribeOn.png" width="100%">
     *
     * @param {Scheduler} scheduler - The IScheduler to perform subscription actions on.
     * @return {Observable<T>} The source Observable modified so that its subscriptions happen on the specified IScheduler.
     .
     * @method subscribeOn
     * @owner Observable
     */
    export function subscribeOn<T>(this: Observable<T>, scheduler: IScheduler, delay?: number): Observable<T>;
}
declare module "rxjs/add/operator/subscribeOn" {
    import { subscribeOn } from "rxjs/operator/subscribeOn";
    module "Observable" {
        interface Observable<T> {
            subscribeOn: typeof subscribeOn;
        }
    }
}
declare module "rxjs/operator/switch" {
    import { Observable } from "rxjs/Observable";
    /**
     * Converts a higher-order Observable into a first-order Observable by
     * subscribing to only the most recently emitted of those inner Observables.
     *
     * <span class="informal">Flattens an Observable-of-Observables by dropping the
     * previous inner Observable once a new one appears.</span>
     *
     * <img src="./img/switch.png" width="100%">
     *
     * `switch` subscribes to an Observable that emits Observables, also known as a
     * higher-order Observable. Each time it observes one of these emitted inner
     * Observables, the output Observable subscribes to the inner Observable and
     * begins emitting the items emitted by that. So far, it behaves
     * like {@link mergeAll}. However, when a new inner Observable is emitted,
     * `switch` unsubscribes from the earlier-emitted inner Observable and
     * subscribes to the new inner Observable and begins emitting items from it. It
     * continues to behave like this for subsequent inner Observables.
     *
     * @example <caption>Rerun an interval Observable on every click event</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * // Each click event is mapped to an Observable that ticks every second
     * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
     * var switched = higherOrder.switch();
     * // The outcome is that `switched` is essentially a timer that restarts
     * // on every click. The interval Observables from older clicks do not merge
     * // with the current interval Observable.
     * switched.subscribe(x => console.log(x));
     *
     * @see {@link combineAll}
     * @see {@link concatAll}
     * @see {@link exhaust}
     * @see {@link mergeAll}
     * @see {@link switchMap}
     * @see {@link switchMapTo}
     * @see {@link zipAll}
     *
     * @return {Observable<T>} An Observable that emits the items emitted by the
     * Observable most recently emitted by the source Observable.
     * @method switch
     * @name switch
     * @owner Observable
     */
    export function _switch<T>(this: Observable<T>): T;
}
declare module "rxjs/add/operator/switch" {
    import { _switch } from "rxjs/operator/switch";
    module "Observable" {
        interface Observable<T> {
            switch: typeof _switch;
            _switch: typeof _switch;
        }
    }
}
declare module "rxjs/operator/switchMap" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    export function switchMap<T, R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<R>): Observable<R>;
    export function switchMap<T, I, R>(this: Observable<T>, project: (value: T, index: number) => ObservableInput<I>, resultSelector: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R): Observable<R>;
}
declare module "rxjs/add/operator/switchMap" {
    import { switchMap } from "rxjs/operator/switchMap";
    module "Observable" {
        interface Observable<T> {
            switchMap: typeof switchMap;
        }
    }
}
declare module "rxjs/operator/switchMapTo" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    export function switchMapTo<T, R>(this: Observable<T>, observable: ObservableInput<R>): Observable<R>;
    export function switchMapTo<T, I, R>(this: Observable<T>, observable: ObservableInput<I>, resultSelector: (outerValue: T, innerValue: I, outerIndex: number, innerIndex: number) => R): Observable<R>;
}
declare module "rxjs/add/operator/switchMapTo" {
    import { switchMapTo } from "rxjs/operator/switchMapTo";
    module "Observable" {
        interface Observable<T> {
            switchMapTo: typeof switchMapTo;
        }
    }
}
declare module "rxjs/operator/take" {
    import { Observable } from "rxjs/Observable";
    /**
     * Emits only the first `count` values emitted by the source Observable.
     *
     * <span class="informal">Takes the first `count` values from the source, then
     * completes.</span>
     *
     * <img src="./img/take.png" width="100%">
     *
     * `take` returns an Observable that emits only the first `count` values emitted
     * by the source Observable. If the source emits fewer than `count` values then
     * all of its values are emitted. After that, it completes, regardless if the
     * source completes.
     *
     * @example <caption>Take the first 5 seconds of an infinite 1-second interval Observable</caption>
     * var interval = Rx.Observable.interval(1000);
     * var five = interval.take(5);
     * five.subscribe(x => console.log(x));
     *
     * @see {@link takeLast}
     * @see {@link takeUntil}
     * @see {@link takeWhile}
     * @see {@link skip}
     *
     * @throws {ArgumentOutOfRangeError} When using `take(i)`, it delivers an
     * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
     *
     * @param {number} count The maximum number of `next` values to emit.
     * @return {Observable<T>} An Observable that emits only the first `count`
     * values emitted by the source Observable, or all of the values from the source
     * if the source emits fewer than `count` values.
     * @method take
     * @owner Observable
     */
    export function take<T>(this: Observable<T>, count: number): Observable<T>;
}
declare module "rxjs/add/operator/take" {
    import { take } from "rxjs/operator/take";
    module "Observable" {
        interface Observable<T> {
            take: typeof take;
        }
    }
}
declare module "rxjs/operator/takeLast" {
    import { Observable } from "rxjs/Observable";
    /**
     * Emits only the last `count` values emitted by the source Observable.
     *
     * <span class="informal">Remembers the latest `count` values, then emits those
     * only when the source completes.</span>
     *
     * <img src="./img/takeLast.png" width="100%">
     *
     * `takeLast` returns an Observable that emits at most the last `count` values
     * emitted by the source Observable. If the source emits fewer than `count`
     * values then all of its values are emitted. This operator must wait until the
     * `complete` notification emission from the source in order to emit the `next`
     * values on the output Observable, because otherwise it is impossible to know
     * whether or not more values will be emitted on the source. For this reason,
     * all values are emitted synchronously, followed by the complete notification.
     *
     * @example <caption>Take the last 3 values of an Observable with many values</caption>
     * var many = Rx.Observable.range(1, 100);
     * var lastThree = many.takeLast(3);
     * lastThree.subscribe(x => console.log(x));
     *
     * @see {@link take}
     * @see {@link takeUntil}
     * @see {@link takeWhile}
     * @see {@link skip}
     *
     * @throws {ArgumentOutOfRangeError} When using `takeLast(i)`, it delivers an
     * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
     *
     * @param {number} count The maximum number of values to emit from the end of
     * the sequence of values emitted by the source Observable.
     * @return {Observable<T>} An Observable that emits at most the last count
     * values emitted by the source Observable.
     * @method takeLast
     * @owner Observable
     */
    export function takeLast<T>(this: Observable<T>, count: number): Observable<T>;
}
declare module "rxjs/add/operator/takeLast" {
    import { takeLast } from "rxjs/operator/takeLast";
    module "Observable" {
        interface Observable<T> {
            takeLast: typeof takeLast;
        }
    }
}
declare module "rxjs/operator/takeUntil" {
    import { Observable } from "rxjs/Observable";
    /**
     * Emits the values emitted by the source Observable until a `notifier`
     * Observable emits a value.
     *
     * <span class="informal">Lets values pass until a second Observable,
     * `notifier`, emits something. Then, it completes.</span>
     *
     * <img src="./img/takeUntil.png" width="100%">
     *
     * `takeUntil` subscribes and begins mirroring the source Observable. It also
     * monitors a second Observable, `notifier` that you provide. If the `notifier`
     * emits a value or a complete notification, the output Observable stops
     * mirroring the source Observable and completes.
     *
     * @example <caption>Tick every second until the first click happens</caption>
     * var interval = Rx.Observable.interval(1000);
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = interval.takeUntil(clicks);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link take}
     * @see {@link takeLast}
     * @see {@link takeWhile}
     * @see {@link skip}
     *
     * @param {Observable} notifier The Observable whose first emitted value will
     * cause the output Observable of `takeUntil` to stop emitting values from the
     * source Observable.
     * @return {Observable<T>} An Observable that emits the values from the source
     * Observable until such time as `notifier` emits its first value.
     * @method takeUntil
     * @owner Observable
     */
    export function takeUntil<T>(this: Observable<T>, notifier: Observable<any>): Observable<T>;
}
declare module "rxjs/add/operator/takeUntil" {
    import { takeUntil } from "rxjs/operator/takeUntil";
    module "Observable" {
        interface Observable<T> {
            takeUntil: typeof takeUntil;
        }
    }
}
declare module "rxjs/operator/takeWhile" {
    import { Observable } from "rxjs/Observable";
    /**
     * Emits values emitted by the source Observable so long as each value satisfies
     * the given `predicate`, and then completes as soon as this `predicate` is not
     * satisfied.
     *
     * <span class="informal">Takes values from the source only while they pass the
     * condition given. When the first value does not satisfy, it completes.</span>
     *
     * <img src="./img/takeWhile.png" width="100%">
     *
     * `takeWhile` subscribes and begins mirroring the source Observable. Each value
     * emitted on the source is given to the `predicate` function which returns a
     * boolean, representing a condition to be satisfied by the source values. The
     * output Observable emits the source values until such time as the `predicate`
     * returns false, at which point `takeWhile` stops mirroring the source
     * Observable and completes the output Observable.
     *
     * @example <caption>Emit click events only while the clientX property is greater than 200</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.takeWhile(ev => ev.clientX > 200);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link take}
     * @see {@link takeLast}
     * @see {@link takeUntil}
     * @see {@link skip}
     *
     * @param {function(value: T, index: number): boolean} predicate A function that
     * evaluates a value emitted by the source Observable and returns a boolean.
     * Also takes the (zero-based) index as the second argument.
     * @return {Observable<T>} An Observable that emits the values from the source
     * Observable so long as each value satisfies the condition defined by the
     * `predicate`, then completes.
     * @method takeWhile
     * @owner Observable
     */
    export function takeWhile<T>(this: Observable<T>, predicate: (value: T, index: number) => boolean): Observable<T>;
}
declare module "rxjs/add/operator/takeWhile" {
    import { takeWhile } from "rxjs/operator/takeWhile";
    module "Observable" {
        interface Observable<T> {
            takeWhile: typeof takeWhile;
        }
    }
}
declare module "rxjs/operator/throttle" {
    import { Observable, SubscribableOrPromise } from "rxjs/Observable";
    /**
     * Emits a value from the source Observable, then ignores subsequent source
     * values for a duration determined by another Observable, then repeats this
     * process.
     *
     * <span class="informal">It's like {@link throttleTime}, but the silencing
     * duration is determined by a second Observable.</span>
     *
     * <img src="./img/throttle.png" width="100%">
     *
     * `throttle` emits the source Observable values on the output Observable
     * when its internal timer is disabled, and ignores source values when the timer
     * is enabled. Initially, the timer is disabled. As soon as the first source
     * value arrives, it is forwarded to the output Observable, and then the timer
     * is enabled by calling the `durationSelector` function with the source value,
     * which returns the "duration" Observable. When the duration Observable emits a
     * value or completes, the timer is disabled, and this process repeats for the
     * next source value.
     *
     * @example <caption>Emit clicks at a rate of at most one click per second</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.throttle(ev => Rx.Observable.interval(1000));
     * result.subscribe(x => console.log(x));
     *
     * @see {@link audit}
     * @see {@link debounce}
     * @see {@link delayWhen}
     * @see {@link sample}
     * @see {@link throttleTime}
     *
     * @param {function(value: T): SubscribableOrPromise} durationSelector A function
     * that receives a value from the source Observable, for computing the silencing
     * duration for each source value, returned as an Observable or a Promise.
     * @return {Observable<T>} An Observable that performs the throttle operation to
     * limit the rate of emissions from the source.
     * @method throttle
     * @owner Observable
     */
    export function throttle<T>(this: Observable<T>, durationSelector: (value: T) => SubscribableOrPromise<number>): Observable<T>;
}
declare module "rxjs/add/operator/throttle" {
    import { throttle } from "rxjs/operator/throttle";
    module "Observable" {
        interface Observable<T> {
            throttle: typeof throttle;
        }
    }
}
declare module "rxjs/operator/throttleTime" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    /**
     * Emits a value from the source Observable, then ignores subsequent source
     * values for `duration` milliseconds, then repeats this process.
     *
     * <span class="informal">Lets a value pass, then ignores source values for the
     * next `duration` milliseconds.</span>
     *
     * <img src="./img/throttleTime.png" width="100%">
     *
     * `throttleTime` emits the source Observable values on the output Observable
     * when its internal timer is disabled, and ignores source values when the timer
     * is enabled. Initially, the timer is disabled. As soon as the first source
     * value arrives, it is forwarded to the output Observable, and then the timer
     * is enabled. After `duration` milliseconds (or the time unit determined
     * internally by the optional `scheduler`) has passed, the timer is disabled,
     * and this process repeats for the next source value. Optionally takes a
     * {@link IScheduler} for managing timers.
     *
     * @example <caption>Emit clicks at a rate of at most one click per second</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.throttleTime(1000);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link auditTime}
     * @see {@link debounceTime}
     * @see {@link delay}
     * @see {@link sampleTime}
     * @see {@link throttle}
     *
     * @param {number} duration Time to wait before emitting another value after
     * emitting the last value, measured in milliseconds or the time unit determined
     * internally by the optional `scheduler`.
     * @param {Scheduler} [scheduler=async] The {@link IScheduler} to use for
     * managing the timers that handle the sampling.
     * @return {Observable<T>} An Observable that performs the throttle operation to
     * limit the rate of emissions from the source.
     * @method throttleTime
     * @owner Observable
     */
    export function throttleTime<T>(this: Observable<T>, duration: number, scheduler?: IScheduler): Observable<T>;
}
declare module "rxjs/add/operator/throttleTime" {
    import { throttleTime } from "rxjs/operator/throttleTime";
    module "Observable" {
        interface Observable<T> {
            throttleTime: typeof throttleTime;
        }
    }
}
declare module "rxjs/operator/timeInterval" {
    import { Observable } from "rxjs/Observable";
    import { IScheduler } from "rxjs/Scheduler";
    /**
     * @param scheduler
     * @return {Observable<TimeInterval<any>>|WebSocketSubject<T>|Observable<T>}
     * @method timeInterval
     * @owner Observable
     */
    export function timeInterval<T>(this: Observable<T>, scheduler?: IScheduler): Observable<TimeInterval<T>>;
    export class TimeInterval<T> {
        value: T;
        interval: number;
        constructor(value: T, interval: number);
    }
}
declare module "rxjs/add/operator/timeInterval" {
    import { timeInterval } from "rxjs/operator/timeInterval";
    module "Observable" {
        interface Observable<T> {
            timeInterval: typeof timeInterval;
        }
    }
}
declare module "rxjs/util/TimeoutError" {
    /**
     * An error thrown when duetime elapses.
     *
     * @see {@link timeout}
     *
     * @class TimeoutError
     */
    export class TimeoutError extends Error {
        constructor();
    }
}
declare module "rxjs/operator/timeout" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    /**
     * @param {number} due
     * @param {Scheduler} [scheduler]
     * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
     * @method timeout
     * @owner Observable
     */
    export function timeout<T>(this: Observable<T>, due: number | Date, scheduler?: IScheduler): Observable<T>;
}
declare module "rxjs/add/operator/timeout" {
    import { timeout } from "rxjs/operator/timeout";
    module "Observable" {
        interface Observable<T> {
            timeout: typeof timeout;
        }
    }
}
declare module "rxjs/operator/timeoutWith" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable, ObservableInput } from "rxjs/Observable";
    export function timeoutWith<T>(this: Observable<T>, due: number | Date, withObservable: ObservableInput<T>, scheduler?: IScheduler): Observable<T>;
    export function timeoutWith<T, R>(this: Observable<T>, due: number | Date, withObservable: ObservableInput<R>, scheduler?: IScheduler): Observable<T | R>;
}
declare module "rxjs/add/operator/timeoutWith" {
    import { timeoutWith } from "rxjs/operator/timeoutWith";
    module "Observable" {
        interface Observable<T> {
            timeoutWith: typeof timeoutWith;
        }
    }
}
declare module "rxjs/operator/timestamp" {
    import { Observable } from "rxjs/Observable";
    import { IScheduler } from "rxjs/Scheduler";
    /**
     * @param scheduler
     * @return {Observable<Timestamp<any>>|WebSocketSubject<T>|Observable<T>}
     * @method timestamp
     * @owner Observable
     */
    export function timestamp<T>(this: Observable<T>, scheduler?: IScheduler): Observable<Timestamp<T>>;
    export class Timestamp<T> {
        value: T;
        timestamp: number;
        constructor(value: T, timestamp: number);
    }
}
declare module "rxjs/add/operator/timestamp" {
    import { timestamp } from "rxjs/operator/timestamp";
    module "Observable" {
        interface Observable<T> {
            timestamp: typeof timestamp;
        }
    }
}
declare module "rxjs/operator/toArray" {
    import { Observable } from "rxjs/Observable";
    /**
     * @return {Observable<any[]>|WebSocketSubject<T>|Observable<T>}
     * @method toArray
     * @owner Observable
     */
    export function toArray<T>(this: Observable<T>): Observable<T[]>;
}
declare module "rxjs/add/operator/toArray" {
    import { toArray } from "rxjs/operator/toArray";
    module "Observable" {
        interface Observable<T> {
            toArray: typeof toArray;
        }
    }
}
declare module "rxjs/operator/toPromise" {
    import { Observable } from "rxjs/Observable";
    export function toPromise<T>(this: Observable<T>): Promise<T>;
    export function toPromise<T>(this: Observable<T>, PromiseCtor: typeof Promise): Promise<T>;
}
declare module "rxjs/add/operator/toPromise" {
    import { toPromise } from "rxjs/operator/toPromise";
    module "Observable" {
        interface Observable<T> {
            toPromise: typeof toPromise;
        }
    }
}
declare module "rxjs/operator/window" {
    import { Observable } from "rxjs/Observable";
    /**
     * Branch out the source Observable values as a nested Observable whenever
     * `windowBoundaries` emits.
     *
     * <span class="informal">It's like {@link buffer}, but emits a nested Observable
     * instead of an array.</span>
     *
     * <img src="./img/window.png" width="100%">
     *
     * Returns an Observable that emits windows of items it collects from the source
     * Observable. The output Observable emits connected, non-overlapping
     * windows. It emits the current window and opens a new one whenever the
     * Observable `windowBoundaries` emits an item. Because each window is an
     * Observable, the output is a higher-order Observable.
     *
     * @example <caption>In every window of 1 second each, emit at most 2 click events</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var interval = Rx.Observable.interval(1000);
     * var result = clicks.window(interval)
     *   .map(win => win.take(2)) // each window has at most 2 emissions
     *   .mergeAll(); // flatten the Observable-of-Observables
     * result.subscribe(x => console.log(x));
     *
     * @see {@link windowCount}
     * @see {@link windowTime}
     * @see {@link windowToggle}
     * @see {@link windowWhen}
     * @see {@link buffer}
     *
     * @param {Observable<any>} windowBoundaries An Observable that completes the
     * previous window and starts a new window.
     * @return {Observable<Observable<T>>} An Observable of windows, which are
     * Observables emitting values of the source Observable.
     * @method window
     * @owner Observable
     */
    export function window<T>(this: Observable<T>, windowBoundaries: Observable<any>): Observable<Observable<T>>;
}
declare module "rxjs/add/operator/window" {
    import { window } from "rxjs/operator/window";
    module "Observable" {
        interface Observable<T> {
            window: typeof window;
        }
    }
}
declare module "rxjs/operator/windowCount" {
    import { Observable } from "rxjs/Observable";
    /**
     * Branch out the source Observable values as a nested Observable with each
     * nested Observable emitting at most `windowSize` values.
     *
     * <span class="informal">It's like {@link bufferCount}, but emits a nested
     * Observable instead of an array.</span>
     *
     * <img src="./img/windowCount.png" width="100%">
     *
     * Returns an Observable that emits windows of items it collects from the source
     * Observable. The output Observable emits windows every `startWindowEvery`
     * items, each containing no more than `windowSize` items. When the source
     * Observable completes or encounters an error, the output Observable emits
     * the current window and propagates the notification from the source
     * Observable. If `startWindowEvery` is not provided, then new windows are
     * started immediately at the start of the source and when each window completes
     * with size `windowSize`.
     *
     * @example <caption>Ignore every 3rd click event, starting from the first one</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.windowCount(3)
     *   .map(win => win.skip(1)) // skip first of every 3 clicks
     *   .mergeAll(); // flatten the Observable-of-Observables
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Ignore every 3rd click event, starting from the third one</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.windowCount(2, 3)
     *   .mergeAll(); // flatten the Observable-of-Observables
     * result.subscribe(x => console.log(x));
     *
     * @see {@link window}
     * @see {@link windowTime}
     * @see {@link windowToggle}
     * @see {@link windowWhen}
     * @see {@link bufferCount}
     *
     * @param {number} windowSize The maximum number of values emitted by each
     * window.
     * @param {number} [startWindowEvery] Interval at which to start a new window.
     * For example if `startWindowEvery` is `2`, then a new window will be started
     * on every other value from the source. A new window is started at the
     * beginning of the source by default.
     * @return {Observable<Observable<T>>} An Observable of windows, which in turn
     * are Observable of values.
     * @method windowCount
     * @owner Observable
     */
    export function windowCount<T>(this: Observable<T>, windowSize: number, startWindowEvery?: number): Observable<Observable<T>>;
}
declare module "rxjs/add/operator/windowCount" {
    import { windowCount } from "rxjs/operator/windowCount";
    module "Observable" {
        interface Observable<T> {
            windowCount: typeof windowCount;
        }
    }
}
declare module "rxjs/operator/windowTime" {
    import { IScheduler } from "rxjs/Scheduler";
    import { Observable } from "rxjs/Observable";
    /**
     * Branch out the source Observable values as a nested Observable periodically
     * in time.
     *
     * <span class="informal">It's like {@link bufferTime}, but emits a nested
     * Observable instead of an array.</span>
     *
     * <img src="./img/windowTime.png" width="100%">
     *
     * Returns an Observable that emits windows of items it collects from the source
     * Observable. The output Observable starts a new window periodically, as
     * determined by the `windowCreationInterval` argument. It emits each window
     * after a fixed timespan, specified by the `windowTimeSpan` argument. When the
     * source Observable completes or encounters an error, the output Observable
     * emits the current window and propagates the notification from the source
     * Observable. If `windowCreationInterval` is not provided, the output
     * Observable starts a new window when the previous window of duration
     * `windowTimeSpan` completes. If `maxWindowCount` is provided, each window
     * will emit at most fixed number of values. Window will complete immediately
     * after emitting last value and next one still will open as specified by
     * `windowTimeSpan` and `windowCreationInterval` arguments.
     *
     * @example <caption>In every window of 1 second each, emit at most 2 click events</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.windowTime(1000)
     *   .map(win => win.take(2)) // each window has at most 2 emissions
     *   .mergeAll(); // flatten the Observable-of-Observables
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Every 5 seconds start a window 1 second long, and emit at most 2 click events per window</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.windowTime(1000, 5000)
     *   .map(win => win.take(2)) // each window has at most 2 emissions
     *   .mergeAll(); // flatten the Observable-of-Observables
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Same as example above but with maxWindowCount instead of take</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks.windowTime(1000, 5000, 2) // each window has still at most 2 emissions
     *   .mergeAll(); // flatten the Observable-of-Observables
     * result.subscribe(x => console.log(x));

     * @see {@link window}
     * @see {@link windowCount}
     * @see {@link windowToggle}
     * @see {@link windowWhen}
     * @see {@link bufferTime}
     *
     * @param {number} windowTimeSpan The amount of time to fill each window.
     * @param {number} [windowCreationInterval] The interval at which to start new
     * windows.
     * @param {number} [maxWindowSize=Number.POSITIVE_INFINITY] Max number of
     * values each window can emit before completion.
     * @param {Scheduler} [scheduler=async] The scheduler on which to schedule the
     * intervals that determine window boundaries.
     * @return {Observable<Observable<T>>} An observable of windows, which in turn
     * are Observables.
     * @method windowTime
     * @owner Observable
     */
    export function windowTime<T>(this: Observable<T>, windowTimeSpan: number, scheduler?: IScheduler): Observable<Observable<T>>;
    export function windowTime<T>(this: Observable<T>, windowTimeSpan: number, windowCreationInterval: number, scheduler?: IScheduler): Observable<Observable<T>>;
    export function windowTime<T>(this: Observable<T>, windowTimeSpan: number, windowCreationInterval: number, maxWindowSize: number, scheduler?: IScheduler): Observable<Observable<T>>;
}
declare module "rxjs/add/operator/windowTime" {
    import { windowTime } from "rxjs/operator/windowTime";
    module "Observable" {
        interface Observable<T> {
            windowTime: typeof windowTime;
        }
    }
}
declare module "rxjs/operator/windowToggle" {
    import { Observable } from "rxjs/Observable";
    /**
     * Branch out the source Observable values as a nested Observable starting from
     * an emission from `openings` and ending when the output of `closingSelector`
     * emits.
     *
     * <span class="informal">It's like {@link bufferToggle}, but emits a nested
     * Observable instead of an array.</span>
     *
     * <img src="./img/windowToggle.png" width="100%">
     *
     * Returns an Observable that emits windows of items it collects from the source
     * Observable. The output Observable emits windows that contain those items
     * emitted by the source Observable between the time when the `openings`
     * Observable emits an item and when the Observable returned by
     * `closingSelector` emits an item.
     *
     * @example <caption>Every other second, emit the click events from the next 500ms</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var openings = Rx.Observable.interval(1000);
     * var result = clicks.windowToggle(openings, i =>
     *   i % 2 ? Rx.Observable.interval(500) : Rx.Observable.empty()
     * ).mergeAll();
     * result.subscribe(x => console.log(x));
     *
     * @see {@link window}
     * @see {@link windowCount}
     * @see {@link windowTime}
     * @see {@link windowWhen}
     * @see {@link bufferToggle}
     *
     * @param {Observable<O>} openings An observable of notifications to start new
     * windows.
     * @param {function(value: O): Observable} closingSelector A function that takes
     * the value emitted by the `openings` observable and returns an Observable,
     * which, when it emits (either `next` or `complete`), signals that the
     * associated window should complete.
     * @return {Observable<Observable<T>>} An observable of windows, which in turn
     * are Observables.
     * @method windowToggle
     * @owner Observable
     */
    export function windowToggle<T, O>(this: Observable<T>, openings: Observable<O>, closingSelector: (openValue: O) => Observable<any>): Observable<Observable<T>>;
}
declare module "rxjs/add/operator/windowToggle" {
    import { windowToggle } from "rxjs/operator/windowToggle";
    module "Observable" {
        interface Observable<T> {
            windowToggle: typeof windowToggle;
        }
    }
}
declare module "rxjs/operator/windowWhen" {
    import { Observable } from "rxjs/Observable";
    /**
     * Branch out the source Observable values as a nested Observable using a
     * factory function of closing Observables to determine when to start a new
     * window.
     *
     * <span class="informal">It's like {@link bufferWhen}, but emits a nested
     * Observable instead of an array.</span>
     *
     * <img src="./img/windowWhen.png" width="100%">
     *
     * Returns an Observable that emits windows of items it collects from the source
     * Observable. The output Observable emits connected, non-overlapping windows.
     * It emits the current window and opens a new one whenever the Observable
     * produced by the specified `closingSelector` function emits an item. The first
     * window is opened immediately when subscribing to the output Observable.
     *
     * @example <caption>Emit only the first two clicks events in every window of [1-5] random seconds</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * var result = clicks
     *   .windowWhen(() => Rx.Observable.interval(1000 + Math.random() * 4000))
     *   .map(win => win.take(2)) // each window has at most 2 emissions
     *   .mergeAll(); // flatten the Observable-of-Observables
     * result.subscribe(x => console.log(x));
     *
     * @see {@link window}
     * @see {@link windowCount}
     * @see {@link windowTime}
     * @see {@link windowToggle}
     * @see {@link bufferWhen}
     *
     * @param {function(): Observable} closingSelector A function that takes no
     * arguments and returns an Observable that signals (on either `next` or
     * `complete`) when to close the previous window and start a new one.
     * @return {Observable<Observable<T>>} An observable of windows, which in turn
     * are Observables.
     * @method windowWhen
     * @owner Observable
     */
    export function windowWhen<T>(this: Observable<T>, closingSelector: () => Observable<any>): Observable<Observable<T>>;
}
declare module "rxjs/add/operator/windowWhen" {
    import { windowWhen } from "rxjs/operator/windowWhen";
    module "Observable" {
        interface Observable<T> {
            windowWhen: typeof windowWhen;
        }
    }
}
declare module "rxjs/operator/withLatestFrom" {
    import { Observable, ObservableInput } from "rxjs/Observable";
    export function withLatestFrom<T, R>(this: Observable<T>, project: (v1: T) => R): Observable<R>;
    export function withLatestFrom<T, T2, R>(this: Observable<T>, v2: ObservableInput<T2>, project: (v1: T, v2: T2) => R): Observable<R>;
    export function withLatestFrom<T, T2, T3, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, project: (v1: T, v2: T2, v3: T3) => R): Observable<R>;
    export function withLatestFrom<T, T2, T3, T4, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, project: (v1: T, v2: T2, v3: T3, v4: T4) => R): Observable<R>;
    export function withLatestFrom<T, T2, T3, T4, T5, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5) => R): Observable<R>;
    export function withLatestFrom<T, T2, T3, T4, T5, T6, R>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>, project: (v1: T, v2: T2, v3: T3, v4: T4, v5: T5, v6: T6) => R): Observable<R>;
    export function withLatestFrom<T, T2>(this: Observable<T>, v2: ObservableInput<T2>): Observable<[T, T2]>;
    export function withLatestFrom<T, T2, T3>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>): Observable<[T, T2, T3]>;
    export function withLatestFrom<T, T2, T3, T4>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>): Observable<[T, T2, T3, T4]>;
    export function withLatestFrom<T, T2, T3, T4, T5>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>): Observable<[T, T2, T3, T4, T5]>;
    export function withLatestFrom<T, T2, T3, T4, T5, T6>(this: Observable<T>, v2: ObservableInput<T2>, v3: ObservableInput<T3>, v4: ObservableInput<T4>, v5: ObservableInput<T5>, v6: ObservableInput<T6>): Observable<[T, T2, T3, T4, T5, T6]>;
    export function withLatestFrom<T, R>(this: Observable<T>, ...observables: Array<ObservableInput<any> | ((...values: Array<any>) => R)>): Observable<R>;
    export function withLatestFrom<T, R>(this: Observable<T>, array: ObservableInput<any>[]): Observable<R>;
    export function withLatestFrom<T, R>(this: Observable<T>, array: ObservableInput<any>[], project: (...values: Array<any>) => R): Observable<R>;
}
declare module "rxjs/add/operator/withLatestFrom" {
    import { withLatestFrom } from "rxjs/operator/withLatestFrom";
    module "Observable" {
        interface Observable<T> {
            withLatestFrom: typeof withLatestFrom;
        }
    }
}
declare module "rxjs/add/operator/zip" {
    import { zipProto } from "rxjs/operator/zip";
    module "Observable" {
        interface Observable<T> {
            zip: typeof zipProto;
        }
    }
}
declare module "rxjs/operator/zipAll" {
    import { Observable } from "rxjs/Observable";
    /**
     * @param project
     * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
     * @method zipAll
     * @owner Observable
     */
    export function zipAll<T, R>(this: Observable<T>, project?: (...values: Array<any>) => R): Observable<R>;
}
declare module "rxjs/add/operator/zipAll" {
    import { zipAll } from "rxjs/operator/zipAll";
    module "Observable" {
        interface Observable<T> {
            zipAll: typeof zipAll;
        }
    }
}
declare module "rxjs/testing/TestMessage" {
    import { Notification } from "rxjs/Notification";
    export interface TestMessage {
        frame: number;
        notification: Notification<any>;
    }
}
declare module "rxjs/testing/SubscriptionLog" {
    export class SubscriptionLog {
        subscribedFrame: number;
        unsubscribedFrame: number;
        constructor(subscribedFrame: number, unsubscribedFrame?: number);
    }
}
declare module "rxjs/testing/SubscriptionLoggable" {
    import { Scheduler } from "rxjs/Scheduler";
    import { SubscriptionLog } from "rxjs/testing/SubscriptionLog";
    export class SubscriptionLoggable {
        subscriptions: SubscriptionLog[];
        scheduler: Scheduler;
        logSubscribedFrame(): number;
        logUnsubscribedFrame(index: number): void;
    }
}
declare module "rxjs/util/applyMixins" {
    export function applyMixins(derivedCtor: any, baseCtors: any[]): void;
}
declare module "rxjs/testing/ColdObservable" {
    import { Observable } from "rxjs/Observable";
    import { Scheduler } from "rxjs/Scheduler";
    import { TestMessage } from "rxjs/testing/TestMessage";
    import { SubscriptionLog } from "rxjs/testing/SubscriptionLog";
    import { SubscriptionLoggable } from "rxjs/testing/SubscriptionLoggable";
    import { Subscriber } from "rxjs/Subscriber";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class ColdObservable<T> extends Observable<T> implements SubscriptionLoggable {
        messages: TestMessage[];
        subscriptions: SubscriptionLog[];
        scheduler: Scheduler;
        logSubscribedFrame: () => number;
        logUnsubscribedFrame: (index: number) => void;
        constructor(messages: TestMessage[], scheduler: Scheduler);
        scheduleMessages(subscriber: Subscriber<any>): void;
    }
}
declare module "rxjs/testing/HotObservable" {
    import { Subject } from "rxjs/Subject";
    import { Subscriber } from "rxjs/Subscriber";
    import { Subscription } from "rxjs/Subscription";
    import { Scheduler } from "rxjs/Scheduler";
    import { TestMessage } from "rxjs/testing/TestMessage";
    import { SubscriptionLog } from "rxjs/testing/SubscriptionLog";
    import { SubscriptionLoggable } from "rxjs/testing/SubscriptionLoggable";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class HotObservable<T> extends Subject<T> implements SubscriptionLoggable {
        messages: TestMessage[];
        subscriptions: SubscriptionLog[];
        scheduler: Scheduler;
        logSubscribedFrame: () => number;
        logUnsubscribedFrame: (index: number) => void;
        constructor(messages: TestMessage[], scheduler: Scheduler);
        protected _subscribe(subscriber: Subscriber<any>): Subscription;
        setup(): void;
    }
}
declare module "rxjs/scheduler/VirtualTimeScheduler" {
    import { AsyncAction } from "rxjs/scheduler/AsyncAction";
    import { Subscription } from "rxjs/Subscription";
    import { AsyncScheduler } from "rxjs/scheduler/AsyncScheduler";
    export class VirtualTimeScheduler extends AsyncScheduler {
        maxFrames: number;
        protected static frameTimeFactor: number;
        frame: number;
        index: number;
        constructor(SchedulerAction?: typeof AsyncAction, maxFrames?: number);
        /**
         * Prompt the Scheduler to execute all of its queued actions, therefore
         * clearing its queue.
         * @return {void}
         */
        flush(): void;
    }
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class VirtualAction<T> extends AsyncAction<T> {
        protected scheduler: VirtualTimeScheduler;
        protected work: (this: VirtualAction<T>, state?: T) => void;
        protected index: number;
        protected active: boolean;
        constructor(scheduler: VirtualTimeScheduler, work: (this: VirtualAction<T>, state?: T) => void, index?: number);
        schedule(state?: T, delay?: number): Subscription;
        protected requestAsyncId(scheduler: VirtualTimeScheduler, id?: any, delay?: number): any;
        protected recycleAsyncId(scheduler: VirtualTimeScheduler, id?: any, delay?: number): any;
        protected _execute(state: T, delay: number): any;
        static sortActions<T>(a: VirtualAction<T>, b: VirtualAction<T>): number;
    }
}
declare module "rxjs/testing/TestScheduler" {
    import { Observable } from "rxjs/Observable";
    import { ColdObservable } from "rxjs/testing/ColdObservable";
    import { HotObservable } from "rxjs/testing/HotObservable";
    import { TestMessage } from "rxjs/testing/TestMessage";
    import { SubscriptionLog } from "rxjs/testing/SubscriptionLog";
    import { VirtualTimeScheduler } from "rxjs/scheduler/VirtualTimeScheduler";
    export type observableToBeFn = (marbles: string, values?: any, errorValue?: any) => void;
    export type subscriptionLogsToBeFn = (marbles: string | string[]) => void;
    export class TestScheduler extends VirtualTimeScheduler {
        assertDeepEqual: (actual: any, expected: any) => boolean | void;
        private hotObservables;
        private coldObservables;
        private flushTests;
        constructor(assertDeepEqual: (actual: any, expected: any) => boolean | void);
        createTime(marbles: string): number;
        createColdObservable<T>(marbles: string, values?: any, error?: any): ColdObservable<T>;
        createHotObservable<T>(marbles: string, values?: any, error?: any): HotObservable<T>;
        private materializeInnerObservable(observable, outerFrame);
        expectObservable(observable: Observable<any>, unsubscriptionMarbles?: string): ({
            toBe: observableToBeFn;
        });
        expectSubscriptions(actualSubscriptionLogs: SubscriptionLog[]): ({
            toBe: subscriptionLogsToBeFn;
        });
        flush(): void;
        static parseMarblesAsSubscriptions(marbles: string): SubscriptionLog;
        static parseMarbles(marbles: string, values?: any, errorValue?: any, materializeInnerObservables?: boolean): TestMessage[];
    }
}
declare module "rxjs/util/AnimationFrame" {
    export class RequestAnimationFrameDefinition {
        cancelAnimationFrame: (handle: number) => void;
        requestAnimationFrame: (cb: () => void) => number;
        constructor(root: any);
    }
    export const AnimationFrame: RequestAnimationFrameDefinition;
}
declare module "rxjs/scheduler/AnimationFrameScheduler" {
    import { AsyncAction } from "rxjs/scheduler/AsyncAction";
    import { AsyncScheduler } from "rxjs/scheduler/AsyncScheduler";
    export class AnimationFrameScheduler extends AsyncScheduler {
        flush(action?: AsyncAction<any>): void;
    }
}
declare module "rxjs/scheduler/AnimationFrameAction" {
    import { AsyncAction } from "rxjs/scheduler/AsyncAction";
    import { AnimationFrameScheduler } from "rxjs/scheduler/AnimationFrameScheduler";
    /**
     * We need this JSDoc comment for affecting ESDoc.
     * @ignore
     * @extends {Ignored}
     */
    export class AnimationFrameAction<T> extends AsyncAction<T> {
        protected scheduler: AnimationFrameScheduler;
        protected work: (this: AnimationFrameAction<T>, state?: T) => void;
        constructor(scheduler: AnimationFrameScheduler, work: (this: AnimationFrameAction<T>, state?: T) => void);
        protected requestAsyncId(scheduler: AnimationFrameScheduler, id?: any, delay?: number): any;
        protected recycleAsyncId(scheduler: AnimationFrameScheduler, id?: any, delay?: number): any;
    }
}
declare module "rxjs/scheduler/animationFrame" {
    import { AnimationFrameScheduler } from "rxjs/scheduler/AnimationFrameScheduler";
    /**
     *
     * Animation Frame Scheduler
     *
     * <span class="informal">Perform task when `window.requestAnimationFrame` would fire</span>
     *
     * When `animationFrame` scheduler is used with delay, it will fall back to {@link async} scheduler
     * behaviour.
     *
     * Without delay, `animationFrame` scheduler can be used to create smooth browser animations.
     * It makes sure scheduled task will happen just before next browser content repaint,
     * thus performing animations as efficiently as possible.
     *
     * @example <caption>Schedule div height animation</caption>
     * const div = document.querySelector('.some-div');
     *
     * Rx.Scheduler.schedule(function(height) {
     *   div.style.height = height + "px";
     *
     *   this.schedule(height + 1);  // `this` references currently executing Action,
     *                               // which we reschedule with new state
     * }, 0, 0);
     *
     * // You will see .some-div element growing in height
     *
     *
     * @static true
     * @name animationFrame
     * @owner Scheduler
     */
    export const animationFrame: AnimationFrameScheduler;
}
declare module "rxjs/Rx" {
    export { Subject, AnonymousSubject } from "rxjs/Subject";
    export { Observable } from "rxjs/Observable";
    import "rxjs/add/observable/bindCallback";
    import "rxjs/add/observable/bindNodeCallback";
    import "rxjs/add/observable/combineLatest";
    import "rxjs/add/observable/concat";
    import "rxjs/add/observable/defer";
    import "rxjs/add/observable/empty";
    import "rxjs/add/observable/forkJoin";
    import "rxjs/add/observable/from";
    import "rxjs/add/observable/fromEvent";
    import "rxjs/add/observable/fromEventPattern";
    import "rxjs/add/observable/fromPromise";
    import "rxjs/add/observable/generate";
    import "rxjs/add/observable/if";
    import "rxjs/add/observable/interval";
    import "rxjs/add/observable/merge";
    import "rxjs/add/observable/race";
    import "rxjs/add/observable/never";
    import "rxjs/add/observable/of";
    import "rxjs/add/observable/onErrorResumeNext";
    import "rxjs/add/observable/pairs";
    import "rxjs/add/observable/range";
    import "rxjs/add/observable/using";
    import "rxjs/add/observable/throw";
    import "rxjs/add/observable/timer";
    import "rxjs/add/observable/zip";
    import "rxjs/add/observable/dom/ajax";
    import "rxjs/add/observable/dom/webSocket";
    import "rxjs/add/operator/buffer";
    import "rxjs/add/operator/bufferCount";
    import "rxjs/add/operator/bufferTime";
    import "rxjs/add/operator/bufferToggle";
    import "rxjs/add/operator/bufferWhen";
    import "rxjs/add/operator/catch";
    import "rxjs/add/operator/combineAll";
    import "rxjs/add/operator/combineLatest";
    import "rxjs/add/operator/concat";
    import "rxjs/add/operator/concatAll";
    import "rxjs/add/operator/concatMap";
    import "rxjs/add/operator/concatMapTo";
    import "rxjs/add/operator/count";
    import "rxjs/add/operator/dematerialize";
    import "rxjs/add/operator/debounce";
    import "rxjs/add/operator/debounceTime";
    import "rxjs/add/operator/defaultIfEmpty";
    import "rxjs/add/operator/delay";
    import "rxjs/add/operator/delayWhen";
    import "rxjs/add/operator/distinct";
    import "rxjs/add/operator/distinctUntilChanged";
    import "rxjs/add/operator/distinctUntilKeyChanged";
    import "rxjs/add/operator/do";
    import "rxjs/add/operator/exhaust";
    import "rxjs/add/operator/exhaustMap";
    import "rxjs/add/operator/expand";
    import "rxjs/add/operator/elementAt";
    import "rxjs/add/operator/filter";
    import "rxjs/add/operator/finally";
    import "rxjs/add/operator/find";
    import "rxjs/add/operator/findIndex";
    import "rxjs/add/operator/first";
    import "rxjs/add/operator/groupBy";
    import "rxjs/add/operator/ignoreElements";
    import "rxjs/add/operator/isEmpty";
    import "rxjs/add/operator/audit";
    import "rxjs/add/operator/auditTime";
    import "rxjs/add/operator/last";
    import "rxjs/add/operator/let";
    import "rxjs/add/operator/every";
    import "rxjs/add/operator/map";
    import "rxjs/add/operator/mapTo";
    import "rxjs/add/operator/materialize";
    import "rxjs/add/operator/max";
    import "rxjs/add/operator/merge";
    import "rxjs/add/operator/mergeAll";
    import "rxjs/add/operator/mergeMap";
    import "rxjs/add/operator/mergeMapTo";
    import "rxjs/add/operator/mergeScan";
    import "rxjs/add/operator/min";
    import "rxjs/add/operator/multicast";
    import "rxjs/add/operator/observeOn";
    import "rxjs/add/operator/onErrorResumeNext";
    import "rxjs/add/operator/pairwise";
    import "rxjs/add/operator/partition";
    import "rxjs/add/operator/pluck";
    import "rxjs/add/operator/publish";
    import "rxjs/add/operator/publishBehavior";
    import "rxjs/add/operator/publishReplay";
    import "rxjs/add/operator/publishLast";
    import "rxjs/add/operator/race";
    import "rxjs/add/operator/reduce";
    import "rxjs/add/operator/repeat";
    import "rxjs/add/operator/repeatWhen";
    import "rxjs/add/operator/retry";
    import "rxjs/add/operator/retryWhen";
    import "rxjs/add/operator/sample";
    import "rxjs/add/operator/sampleTime";
    import "rxjs/add/operator/scan";
    import "rxjs/add/operator/sequenceEqual";
    import "rxjs/add/operator/share";
    import "rxjs/add/operator/single";
    import "rxjs/add/operator/skip";
    import "rxjs/add/operator/skipUntil";
    import "rxjs/add/operator/skipWhile";
    import "rxjs/add/operator/startWith";
    import "rxjs/add/operator/subscribeOn";
    import "rxjs/add/operator/switch";
    import "rxjs/add/operator/switchMap";
    import "rxjs/add/operator/switchMapTo";
    import "rxjs/add/operator/take";
    import "rxjs/add/operator/takeLast";
    import "rxjs/add/operator/takeUntil";
    import "rxjs/add/operator/takeWhile";
    import "rxjs/add/operator/throttle";
    import "rxjs/add/operator/throttleTime";
    import "rxjs/add/operator/timeInterval";
    import "rxjs/add/operator/timeout";
    import "rxjs/add/operator/timeoutWith";
    import "rxjs/add/operator/timestamp";
    import "rxjs/add/operator/toArray";
    import "rxjs/add/operator/toPromise";
    import "rxjs/add/operator/window";
    import "rxjs/add/operator/windowCount";
    import "rxjs/add/operator/windowTime";
    import "rxjs/add/operator/windowToggle";
    import "rxjs/add/operator/windowWhen";
    import "rxjs/add/operator/withLatestFrom";
    import "rxjs/add/operator/zip";
    import "rxjs/add/operator/zipAll";
    export { Operator } from "rxjs/Operator";
    export { Observer } from "rxjs/Observer";
    export { Subscription } from "rxjs/Subscription";
    export { Subscriber } from "rxjs/Subscriber";
    export { AsyncSubject } from "rxjs/AsyncSubject";
    export { ReplaySubject } from "rxjs/ReplaySubject";
    export { BehaviorSubject } from "rxjs/BehaviorSubject";
    export { ConnectableObservable } from "rxjs/observable/ConnectableObservable";
    export { Notification } from "rxjs/Notification";
    export { EmptyError } from "rxjs/util/EmptyError";
    export { ArgumentOutOfRangeError } from "rxjs/util/ArgumentOutOfRangeError";
    export { ObjectUnsubscribedError } from "rxjs/util/ObjectUnsubscribedError";
    export { TimeoutError } from "rxjs/util/TimeoutError";
    export { UnsubscriptionError } from "rxjs/util/UnsubscriptionError";
    export { TimeInterval } from "rxjs/operator/timeInterval";
    export { Timestamp } from "rxjs/operator/timestamp";
    export { TestScheduler } from "rxjs/testing/TestScheduler";
    export { VirtualTimeScheduler } from "rxjs/scheduler/VirtualTimeScheduler";
    export { AjaxRequest, AjaxResponse, AjaxError, AjaxTimeoutError } from "rxjs/observable/dom/AjaxObservable";
    import { AsapScheduler } from "rxjs/scheduler/AsapScheduler";
    import { AsyncScheduler } from "rxjs/scheduler/AsyncScheduler";
    import { QueueScheduler } from "rxjs/scheduler/QueueScheduler";
    import { AnimationFrameScheduler } from "rxjs/scheduler/AnimationFrameScheduler";
    /**
     * @typedef {Object} Rx.Scheduler
     * @property {Scheduler} queue Schedules on a queue in the current event frame
     * (trampoline scheduler). Use this for iteration operations.
     * @property {Scheduler} asap Schedules on the micro task queue, which uses the
     * fastest transport mechanism available, either Node.js' `process.nextTick()`
     * or Web Worker MessageChannel or setTimeout or others. Use this for
     * asynchronous conversions.
     * @property {Scheduler} async Schedules work with `setInterval`. Use this for
     * time-based operations.
     * @property {Scheduler} animationFrame Schedules work with `requestAnimationFrame`.
     * Use this for synchronizing with the platform's painting
     */
    let Scheduler: {
        asap: AsapScheduler;
        queue: QueueScheduler;
        animationFrame: AnimationFrameScheduler;
        async: AsyncScheduler;
    };
    /**
     * @typedef {Object} Rx.Symbol
     * @property {Symbol|string} rxSubscriber A symbol to use as a property name to
     * retrieve an "Rx safe" Observer from an object. "Rx safety" can be defined as
     * an object that has all of the traits of an Rx Subscriber, including the
     * ability to add and remove subscriptions to the subscription chain and
     * guarantees involving event triggering (can't "next" after unsubscription,
     * etc).
     * @property {Symbol|string} observable A symbol to use as a property name to
     * retrieve an Observable as defined by the [ECMAScript "Observable" spec](https://github.com/zenparsing/es-observable).
     * @property {Symbol|string} iterator The ES6 symbol to use as a property name
     * to retrieve an iterator from an object.
     */
    let Symbol: {
        rxSubscriber: any;
        observable: any;
        iterator: any;
    };
    export { Scheduler, Symbol };
}
