export const formatDate = (isoDate: string) => {
  const date = new Date(isoDate)
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return date.toLocaleDateString("en-US", options)
}
