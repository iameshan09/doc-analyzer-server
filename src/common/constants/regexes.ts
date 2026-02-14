const REGEX_NO_WORD_SPACING = /^\S+$/;
const REGEX_NON_ALPANUMERIC_SEQUENCE = /[^a-zA-Z0-9]+/g;
const REGEX_PASSWORD =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,30}$/;

export {
  REGEX_NO_WORD_SPACING,
  REGEX_NON_ALPANUMERIC_SEQUENCE,
  REGEX_PASSWORD,
};
