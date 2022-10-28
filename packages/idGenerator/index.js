import { ulid } from 'ulid'

export const id = (prefix = '') => {
  return [prefix, ulid().toLowerCase()].filter((e) => e).join('_')
}
