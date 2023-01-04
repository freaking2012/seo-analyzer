// import Logger from './logger';
// const logger = new Logger();

function titleLengthRule(dom, options) {
  return new Promise(resolve => {
    // resolve('Verifying titleLengthRule rule...');
    const document = dom.window.document;
    const title = document.querySelector('title');
    if (!title) {
      resolve('Document doesn\'t have a <title> element');
    }
    // If title exists in the DOM
    const titleLength = title.length;
    if (titleLength < options.min) {
      resolve(
        `<title> too short(${titleLength}). The minimum length should be ${options.min} characters.`
      );
    }
    if (titleLength > options.max) {
      resolve(
        `<title> too long(${titleLength}). The maximum length should be ${options.max} characters.`
      );
    }
    resolve(null);
  });
}

export default titleLengthRule;
