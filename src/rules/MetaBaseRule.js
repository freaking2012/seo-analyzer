function metaBaseRule(dom, options = { list: [] }) {
  return new Promise(resolve => {
    const report = [];
    // report.push('Verifying metaBaseRule rule...');
    if (options && options.list && options.list.length) {
      options.list.forEach(name => {
        const element = dom.window.document.querySelector(
          `head > meta[name="${name}"]`
        );
        if (!element) {
          report.push(`This page doesn't have <meta name="${name}"> tag`);
        } else if (!element.content) {
          report.push(
            `The content attribute for the <meta name="${name}" content=""> tag is empty`
          );
        }
      });
    }
    resolve(report);
  });
}

export default metaBaseRule;
