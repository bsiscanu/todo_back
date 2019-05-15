/**
 * Binds the function to the host object
 *
 * @param {any} target
 * @param {string} property
 * @param {PropertyDescriptor} descriptor
 * @return {void}
 */
export default function Middleware(target: any, property: string, descriptor: PropertyDescriptor): void {
  target[property].bind(target);
}
