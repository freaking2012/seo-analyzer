function canonicalLinkRule(dom) {
  return new Promise(resolve => {
    const element = dom.window.document.querySelector(
      'head > link[rel="canonical"]'
    );
    // resolve('Veryfing canonicalLinkRule...');
    if (!element) {
      resolve('This page doesn\'t have <link rel=\'canonical\' href=\'...\'> link');
    }
    if (element && !element.href) {
      resolve('The canonical link without href attribute');
    }
    if (element && element.href.substr(-1) !== '/') {
      resolve(
        'The href attribute does not have a slash at the end of the link.'
      );
    }
    resolve(null);
  });
}

export default canonicalLinkRule;
