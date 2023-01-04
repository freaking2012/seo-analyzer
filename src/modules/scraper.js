import axios from 'axios';
import sitemaps from 'sitemap-stream-parser';
import cliProgress from 'cli-progress';
import _colors from 'colors';
import Logger from './logger';
const puppeteer = require('puppeteer');

class Scanner {
  constructor() {
    this.consoleProgressBar = new cliProgress.Bar({
      format:
        'Processing... |' +
        _colors.green('{bar}') +
        '| {percentage}% || {value}/{total} Pages',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
    this.logger = new Logger();
    this.inputUrl = '';
    this.ignoreUrls = '';
    this.includeUrls = '';
    this.inputUrl = '';
  }

  /**
   * @param {Number} port - Port for the server to listen on
   * @returns {Array} - Array of html doms
   * @description - Scrapes the site and returns the html doms
   */
  async run(port, ignoreUrls, includeUrls, sitemap, authCookie) {
    this.inputUrl = `http://localhost:${port}`;
    this.ignoreUrls = ignoreUrls;
    this.includeUrls = includeUrls;
    const links = await this._getLinksFromSitemap(sitemap);
    const htmlDoms = await this._getHtmlDomFromLinks(links, authCookie);
    return htmlDoms;
  }

  /**
   * Get the links from the sitemap
   * @returns {Array} - Array of links
   * @description - Scrapes the sitemap and returns the links
   */
  _getLinksFromSitemap(sitemap) {
    this.logger.info(`🚀  Get sitemap from ${this.inputUrl}/${sitemap}`);
    return new Promise(resolve => {
      const formattedUrl = `${this.inputUrl}/${sitemap}`;
      const links = [];
      sitemaps.parseSitemaps(
        formattedUrl,
        link => {
          // Ignore the links that are in the ignore list
          const path = link.replace(/^.*\/\/[^/]+/, '');
          if (this.includeUrls && this.includeUrls.length > 0) {
            if (this.includeUrls.includes(path)) {
              links.push(this._formatLink(link));
            }
          }
          else if (this.ignoreUrls.indexOf(path) === -1) {
            links.push(this._formatLink(link));
          }
        },
        err => {
          if (err) {
            this.logger.error('❌  Sitemap not found\n', 1);
          } else {
            if (!links.length) {
              this.logger.error('❌  Links not found\n', 1);
            } else {
              this.logger.success(' ✅  Done\n');
              this.logger.info('Links to be verified :-');
              links.forEach((link, index) => this.logger.info(`${(index + 1) }. ${link}`));
              this.logger.success('\n');
              resolve(links);
            }
          }
        }
      );
    });
  }

  /**
   * Formats the link to be used in axios
   * @param {String} link
   * @returns {String} - Formatted link > http://localhost:{port}/link
   */
  _formatLink(link) {
    const result = link.replace(/^.*\/\/[^/]+/, this.inputUrl);
    return result;
  }

  /**
   * Sleep for the given time in milliseconds
   * @param {Number} ms
   * @returns {Promise}
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getHTMLDOM (url, authCookie) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const cookie = {'name': authCookie.key, 'value': authCookie.value, 'url': url};
    await page.setCookie(cookie);
    await page.goto(url, {timeout: 0});
    await page.waitForTimeout(20000);
    // const html = await page.evaluate(() => document.body.innerHTML);
    const html = await page.content();
    // console.log('url: ' + url + ' html: ' + html);
    browser.close();
    return html;
  }

  /**
   * Get the html doms from the links
   * @param {Array} links - Array of links
   * @returns {Array} - Array of html doms
   * @description - Scrapes the links and returns the html doms
   */
  async _getHtmlDomFromLinks(links, authCookie) {
    const htmlDoms = [];
    const promises = [];
    this.logger.info('🚀  Parsing HTML\n');
    // Start the progress bar
    this.consoleProgressBar.start(links.length, 0);
    for (const link of links) {
      promises.push(
        this.getHTMLDOM(link, authCookie).then(
          res => {
            htmlDoms.push({ source: link, text: res });
            this.consoleProgressBar.increment();
          }
        )

        // axios
        //   .get(link)
        //   .then(res => {
        //     if (res && res.status === 200) {
        //       htmlDoms.push({ source: link, text: res.data });
        //     }
        //   })
        //   .catch(error => {
        //     const err =
        //       (error && error.response && error.response.status) || 500;
        //     console.log(`Error: ${error} - ${link}`);
        //     console.log(
        //       `\n${_colors.yellow('==>')} ${_colors.white(link)} ${_colors.red(
        //         err
        //       )}`
        //     );
        //   })
        //   .finally(() => {
        //     this.consoleProgressBar.increment();
        //   })




      );
      await this.sleep(500);
    }

    return Promise.all(promises).then(() => {
      // // Stop the progress bar
      this.consoleProgressBar.stop();
      return htmlDoms;
    });
  }
}

export default Scanner;
