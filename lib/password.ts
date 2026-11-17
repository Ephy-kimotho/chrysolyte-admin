// Look-alike characters (0/O, 1/l/I) are left out so a password read aloud or
// copied by hand comes through intact.
const UPPERCASE = "ABCDEFGHJKLMNPQRSTUVWXYZ"
const LOWERCASE = "abcdefghijkmnpqrstuvwxyz"
const DIGITS = "23456789"
const SYMBOLS = "!@#$%&*?-_"
const ALL = UPPERCASE + LOWERCASE + DIGITS + SYMBOLS

function randomIndex(max: number) {
  const [value] = crypto.getRandomValues(new Uint32Array(1))
  return value % max
}

function pick(characters: string) {
  return characters[randomIndex(characters.length)]
}

/**
 * A random password that meets `passwordSchema`: at least one uppercase,
 * lowercase, number and symbol, from the browser's secure random source.
 */
export function generatePassword(length = 14) {
  const characters = [
    pick(UPPERCASE),
    pick(LOWERCASE),
    pick(DIGITS),
    pick(SYMBOLS),
  ]
  while (characters.length < length) characters.push(pick(ALL))

  // Shuffle so the guaranteed characters aren't always at the front.
  for (let i = characters.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1)
    ;[characters[i], characters[j]] = [characters[j], characters[i]]
  }

  return characters.join("")
}
