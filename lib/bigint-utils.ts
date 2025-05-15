export function safeParseInt(value: any): number {
  try {
    if (typeof value === "bigint") {
      return Number(value)
    }
    if (typeof value === "number") {
      return value
    }
    if (typeof value === "string") {
      return Number.parseInt(value, 10)
    }
    return Number(value)
  } catch (error) {
    console.error("Failed to parse value as Int", value, error)
    return 0
  }
}

export function safeStringifyBigInt(obj: any): string {
  return JSON.stringify(
    obj,
    (key, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
  )
}
