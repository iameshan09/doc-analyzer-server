// Parse JSON string or return original value if parsing fails
const toJSON = (v: any) => {
  try {
    return JSON.parse(v);
  } catch (err) {
    return v;
  }
};

export { toJSON };
