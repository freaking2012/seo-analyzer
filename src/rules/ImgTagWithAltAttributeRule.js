let whitelist = ['id', 'tagName', 'alt', 'className', 'childNodes'];

function imgTagWithAltAttributeRule(dom) {
  const domToObj = (domEl, report) => {
    var obj = {};
    for (let i=0; i<whitelist.length; i++) {
      // report.push(`domEl[whitelist[i]]: ${domEl[whitelist[i]]}`);
      obj[whitelist[i]] = domEl[whitelist[i]];
      // if (domEl[whitelist[i]] instanceof NodeList) {
      //   obj[whitelist[i]] = Array.from(domEl[whitelist[i]]);
      // }
      // else {
      //   obj[whitelist[i]] = domEl[whitelist[i]];
      // }
    }
    return obj;
  };

  const getStringifiedValues = (container, report) => {
    return JSON.stringify(container,  (name, value) => {
      if (name === '') {
        return domToObj(value, report);
      }
      if (Array.isArray(this)) {
        if (typeof value === 'object') {
          return domToObj(value, report);
        }
        return value;
      }
      if (whitelist.find(x => (x === name)))
        return value;
      return '';
    });
  };

  return new Promise(resolve => {
    let countAlt = 0;
    let countSrc = 0;
    const report = [];
    const elements = dom.window.document.querySelectorAll('img');

    elements.forEach(element => {
      if (!element.alt) {
        countAlt++;
      }
      if (!element.src) {
        countSrc++;
      }
    });

    if (countSrc > 0) {
      report.push(`There are ${countSrc} <img> tag without src attribute`);
    }

    if (countAlt > 0) {
      report.push(`There are ${countAlt} <img> tag without alt attribute`);
    }

    if (countSrc || countAlt) {
      resolve(report);
    }

    resolve(null);
  });
}

export default imgTagWithAltAttributeRule;
