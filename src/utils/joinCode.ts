/** Short human-typeable codes for school/class self-enrolment (e.g. "SPC-4F9K"). */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I — easy to read aloud

function randomSegment(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

/** e.g. generateJoinCode("SPC") -> "SPC-4F9K" */
export function generateJoinCode(prefix: string): string {
  return `${prefix.toUpperCase()}-${randomSegment(4)}`;
}
