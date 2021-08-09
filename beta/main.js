(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /root/ebook-reader/src/main.ts */"zUnb");


/***/ }),

/***/ "0eCp":
/*!******************************************!*\
  !*** ./src/app/auto-scroller.service.ts ***!
  \******************************************/
/*! exports provided: AutoScrollerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AutoScrollerService", function() { return AutoScrollerService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

const autoScrollMultiplierKey = 'autoScrollMultiplier';
class AutoScrollerService {
    constructor() {
        this.activated = false;
        const storedMultiplier = localStorage.getItem(autoScrollMultiplierKey);
        if (storedMultiplier) {
            this.multiplier = +storedMultiplier;
        }
        else {
            this.multiplier = 20;
        }
    }
    increaseSpeed() {
        this.multiplier += 1;
        localStorage.setItem(autoScrollMultiplierKey, `${this.multiplier}`);
    }
    decreaseSpeed() {
        this.multiplier = Math.max(1, this.multiplier - 1);
        localStorage.setItem(autoScrollMultiplierKey, `${this.multiplier}`);
    }
    stop() {
        this.activated = false;
    }
    toggle() {
        this.activated = !this.activated;
        if (this.activated) {
            this.autoScrollTick(Date.now(), document.documentElement.scrollLeft);
        }
    }
    autoScrollTick(previousTick, expectedPos) {
        const currentTick = Date.now();
        const pixelsPerMs = -0.00091489 * this.multiplier;
        let calculatedCurrentPos;
        if (Math.abs(expectedPos - document.documentElement.scrollLeft) < 1) {
            calculatedCurrentPos = expectedPos;
        }
        else {
            // scrollLeft interrupted by something else
            calculatedCurrentPos = document.documentElement.scrollLeft;
        }
        const newExpectedPos = calculatedCurrentPos + (pixelsPerMs * (currentTick - previousTick));
        document.documentElement.scrollBy(newExpectedPos - document.documentElement.scrollLeft, 0);
        if (this.activated) {
            window.requestAnimationFrame(() => {
                this.autoScrollTick(currentTick, newExpectedPos);
            });
        }
    }
}
AutoScrollerService.ɵfac = function AutoScrollerService_Factory(t) { return new (t || AutoScrollerService)(); };
AutoScrollerService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AutoScrollerService, factory: AutoScrollerService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "7n3V":
/*!**************************************************!*\
  !*** ./src/app/ebook-display-manager.service.ts ***!
  \**************************************************/
/*! exports provided: EbookDisplayManagerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EbookDisplayManagerService", function() { return EbookDisplayManagerService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _utils_local_storage_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/local-storage-utils */ "lgdk");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");



// https://www.unicode.org/Public/UCD/latest/ucd/PropList.txt
const isNotJapaneseRegex = /[^0-9A-Z○◯々-〇〻ぁ-ゖゝ-ゞァ-ヺー０-９Ａ-Ｚｦ-ﾝ\p{Ideographic}\p{Radical}\p{Unified_Ideograph}]+/gmiu;
class EbookDisplayManagerService {
    constructor() {
        this.loadingFile$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](false);
        this.loadingFiles$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](undefined);
        this.contentEl = document.createElement('div');
        this.contentChanged = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        this.revalidateFile = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        this.allowScroll = true;
        this.totalCharCount = 0;
        this.bookStyle = document.createElement('style');
        document.head.insertBefore(this.bookStyle, document.head.firstChild);
        this.fontSize$ = Object(_utils_local_storage_utils__WEBPACK_IMPORTED_MODULE_1__["createNumberLocalStorageBehaviorSubject"])('fontSize', 20);
        this.hideSpoilerImage$ = Object(_utils_local_storage_utils__WEBPACK_IMPORTED_MODULE_1__["createBooleanLocalStorageBehaviorSubject"])('hideSpoilerImage', true);
        this.hideFurigana$ = Object(_utils_local_storage_utils__WEBPACK_IMPORTED_MODULE_1__["createBooleanLocalStorageBehaviorSubject"])('hideFurigana', false);
    }
    updateContent(el, styleString) {
        if (this.contentEl.firstChild) {
            this.contentEl.replaceChild(el, this.contentEl.firstChild);
        }
        else {
            this.contentEl.appendChild(el);
        }
        const styleNode = document.createTextNode(styleString);
        if (this.bookStyle.firstChild) {
            this.bookStyle.replaceChild(styleNode, this.bookStyle.firstChild);
        }
        else {
            this.bookStyle.appendChild(styleNode);
        }
        this.contentChanged.next();
    }
    getCharCount(el) {
        const totalLength = countUnicodeCharacters(el.innerText.replace(isNotJapaneseRegex, ''));
        let totalRtLength = 0;
        for (const rtTag of el.getElementsByTagName('rt')) {
            totalRtLength += countUnicodeCharacters(rtTag.innerText.replace(isNotJapaneseRegex, ''));
        }
        let totalCustomCharLength = 0;
        for (const spoilerEl of el.getElementsByClassName('spoiler-label')) {
            totalCustomCharLength += countUnicodeCharacters(spoilerEl.innerText.replace(isNotJapaneseRegex, ''));
        }
        for (const placeholderEl of el.getElementsByClassName('placeholder-br')) {
            totalCustomCharLength += countUnicodeCharacters(placeholderEl.innerText.replace(isNotJapaneseRegex, ''));
        }
        let imageTextCount = 0;
        for (const imgTag of el.getElementsByTagName('img')) {
            if ([...imgTag.classList.values()].some((className) => className.includes('gaiji'))) {
                imageTextCount += 1;
            }
        }
        return totalLength - totalRtLength - totalCustomCharLength + imageTextCount;
    }
}
EbookDisplayManagerService.ɵfac = function EbookDisplayManagerService_Factory(t) { return new (t || EbookDisplayManagerService)(); };
EbookDisplayManagerService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: EbookDisplayManagerService, factory: EbookDisplayManagerService.ɵfac, providedIn: 'root' });
/**
 * Because '𠮟る'.length = 3
 * Reference: https://dmitripavlutin.com/what-every-javascript-developer-should-know-about-unicode/#length-and-surrogate-pairs
 */
function countUnicodeCharacters(s) {
    return [...s].length;
}


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "CJaY":
/*!**************************************************!*\
  !*** ./src/app/reading-stats-manager-service.ts ***!
  \**************************************************/
/*! exports provided: ReadingStatsManagerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReadingStatsManagerService", function() { return ReadingStatsManagerService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _database_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./database.service */ "c92J");
/* harmony import */ var _scroll_information_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scroll-information.service */ "wm/D");





class ReadingStatsManagerService {
    constructor(databaseService, scrollInformationService) {
        this.databaseService = databaseService;
        this.scrollInformationService = scrollInformationService;
        this.startingCharCount = 0;
        this.identifier = NaN;
        this.currentlyTracking$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](false);
        scrollInformationService.exploredCharCountUpdated$.subscribe(() => this.updateCharCountInfo());
    }
    setIdentifier(id) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.identifier = id;
            // Reset state
            this.currentlyTracking$.next(false);
            this.startingCharCount = 0;
            this.clearCharCountInfo();
            // Fetch new state
            this.updateTrackingStatus();
        });
    }
    updateTrackingStatus() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const db = yield this.databaseService.db;
            const startingCharCountObj = yield db.get('startingCharCount', this.identifier);
            if (startingCharCountObj) {
                this.currentlyTracking$.next(true);
                this.startingCharCount = startingCharCountObj.startingCharCount;
                this.updateCharCountInfo();
            }
            else {
                this.currentlyTracking$.next(false);
                this.startingCharCount = 0;
            }
        });
    }
    saveStartingCharCount() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const db = yield this.databaseService.db;
            db.put('startingCharCount', {
                dataId: this.identifier,
                startingCharCount: this.scrollInformationService.exploredCharCount,
            });
            // Update state
            this.currentlyTracking$.next(true);
            this.startingCharCount = this.scrollInformationService.exploredCharCount;
            this.updateCharCountInfo();
        });
    }
    clearStartingCharCount() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const db = yield this.databaseService.db;
            db.delete('startingCharCount', this.identifier);
            // Update state
            this.currentlyTracking$.next(false);
            this.startingCharCount = 0;
            this.clearCharCountInfo();
        });
    }
    updateCharCountInfo() {
        if (this.currentlyTracking$.value) {
            const el = document.getElementById("reading-stats-info");
            if (!el) {
                return;
            }
            const currCharCount = this.scrollInformationService.exploredCharCount - this.startingCharCount;
            el.innerText = `${currCharCount}`;
        }
    }
    clearCharCountInfo() {
        const el = document.getElementById("reading-stats-info");
        if (!el) {
            return;
        }
        el.innerText = `Loading stats...`;
    }
}
ReadingStatsManagerService.ɵfac = function ReadingStatsManagerService_Factory(t) { return new (t || ReadingStatsManagerService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_database_service__WEBPACK_IMPORTED_MODULE_3__["DatabaseService"]), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_scroll_information_service__WEBPACK_IMPORTED_MODULE_4__["ScrollInformationService"])); };
ReadingStatsManagerService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: ReadingStatsManagerService, factory: ReadingStatsManagerService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "EsNf":
/*!*************************************!*\
  !*** ./src/app/utils/html-fixer.ts ***!
  \*************************************/
/*! exports provided: getFormattedElementHtmlz, getFormattedElementEpub, buildDummyBookImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFormattedElementHtmlz", function() { return getFormattedElementHtmlz; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFormattedElementEpub", function() { return getFormattedElementEpub; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildDummyBookImage", function() { return buildDummyBookImage; });
/* harmony import */ var path_browserify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path-browserify */ "33yf");
/* harmony import */ var path_browserify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path_browserify__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @licence
 * Copyright (c) 2021, ッツ Reader Authors
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

function childNodesAfterContents(el) {
    let childNodes = [...el.children];
    const afterContentsDivIndex = childNodes.findIndex((childNode) => childNode.getElementsByTagName('a').length > 1) + 1;
    if (afterContentsDivIndex > 0 && afterContentsDivIndex < childNodes.length) {
        childNodes = childNodes.slice(afterContentsDivIndex);
    }
    return childNodes;
}
/**
 * Clear all references that aren't packed, which could be caused by:
 * - Bad input file (doesn't include the required image)
 * - Bad image file extension
 */
function clearBadImageRef(el) {
    for (const tag of el.getElementsByTagName('image')) {
        const hrefAttr = tag.getAttribute('href');
        if (hrefAttr && !(hrefAttr.startsWith('ttu:') || hrefAttr.startsWith('data:image/gif;ttu:'))) {
            tag.setAttribute('data-ttu-href', hrefAttr);
            tag.removeAttribute('href');
        }
    }
    for (const tag of el.getElementsByTagName('img')) {
        const srcAttr = tag.getAttribute('src');
        if (srcAttr && !(srcAttr.startsWith('ttu:') || srcAttr.startsWith('data:image/gif;ttu:'))) {
            tag.setAttribute('data-ttu-src', srcAttr);
            tag.removeAttribute('src');
        }
    }
}
function getFormattedElementHtmlz(data) {
    // tslint:disable-next-line:no-non-null-assertion
    const regexResult = /.*<body[^>]*>((.|\s)+)<\/body>.*/.exec(data['index.html']);
    let html = regexResult[1];
    for (const [key, value] of Object.entries(data)) {
        if (value instanceof Blob) {
            html = html.replaceAll(key, buildDummyBookImage(key));
        }
    }
    const result = document.createElement('div');
    result.innerHTML = html;
    for (const tag of result.getElementsByTagName('image')) {
        if (!tag.getAttributeNames().some((x) => x === 'href')) {
            for (const attrName of tag.getAttributeNames()) {
                if (attrName.endsWith('href')) {
                    // tslint:disable-next-line:no-non-null-assertion
                    tag.setAttribute('href', tag.getAttribute(attrName));
                }
            }
        }
    }
    for (const tag of result.getElementsByTagName('svg')) {
        tag.removeAttribute('width');
        tag.removeAttribute('height');
    }
    clearBadImageRef(result);
    for (const childNode of childNodesAfterContents(result)) {
        const createWrapper = (tag) => {
            const imgWrapper = document.createElement('span');
            imgWrapper.toggleAttribute('data-ttu-spoiler-img');
            const parentElement = tag.parentElement || childNode;
            parentElement.insertBefore(imgWrapper, tag);
            imgWrapper.appendChild(tag);
        };
        for (const tag of childNode.getElementsByTagName('img')) {
            if (![...tag.classList.values()].some((className) => className.includes('gaiji'))) {
                createWrapper(tag);
            }
        }
        for (const tag of childNode.getElementsByTagName('svg')) {
            if (tag.getElementsByTagName('image').length) {
                createWrapper(tag);
            }
        }
    }
    for (const tag of result.getElementsByTagName('br')) {
        const placeholderEl = document.createElement('span'); // for Firefox
        placeholderEl.classList.add('placeholder-br');
        placeholderEl.setAttribute('aria-hidden', 'true');
        placeholderEl.innerText = '〇';
        const parentElement = tag.parentElement || result;
        parentElement.insertBefore(placeholderEl, tag);
    }
    return result;
}
const prependValue = 'ttu-';
function getFormattedElementEpub(data, contents) {
    const htmlMap = contents.package.manifest.item.reduce((acc, item) => {
        if (item['@_media-type'] === 'application/xhtml+xml') {
            acc[item['@_id']] = item['@_href'];
        }
        return acc;
    }, {});
    const blobsAvailable = Object.entries(data).reduce((acc, [key, value]) => {
        if (value instanceof Blob) {
            acc.push(key);
        }
        return acc;
    }, []);
    const result = document.createElement('div');
    for (const item of contents.package.spine.itemref) {
        const idRef = item['@_idref'];
        const htmlHref = htmlMap[idRef] || '';
        // tslint:disable-next-line:no-non-null-assertion
        const regexResult = /.*<body[^>]*>((.|\s)+)<\/body>.*/.exec(data[htmlHref]);
        let innerHtml = regexResult[1];
        for (const blobKey of blobsAvailable) {
            innerHtml = innerHtml.replaceAll(relative(htmlHref, blobKey), buildDummyBookImage(blobKey));
        }
        const childDiv = document.createElement('div');
        childDiv.innerHTML = innerHtml;
        childDiv.id = `${prependValue}${idRef}`;
        result.appendChild(childDiv);
    }
    for (const tag of result.getElementsByTagName('a')) {
        const oldHref = tag.getAttribute('href');
        if (oldHref) {
            tag.setAttribute('href', '#' + oldHref.replace(/.+#/, ''));
        }
    }
    for (const tag of result.getElementsByTagName('image')) {
        if (!tag.getAttributeNames().some((x) => x === 'href')) {
            for (const attrName of tag.getAttributeNames()) {
                if (attrName.endsWith('href')) {
                    // tslint:disable-next-line:no-non-null-assertion
                    tag.setAttribute('href', tag.getAttribute(attrName));
                }
            }
        }
    }
    for (const tag of result.getElementsByTagName('svg')) {
        tag.removeAttribute('width');
        tag.removeAttribute('height');
    }
    clearBadImageRef(result);
    for (const childNode of childNodesAfterContents(result)) {
        const createWrapper = (tag) => {
            const imgWrapper = document.createElement('span');
            imgWrapper.toggleAttribute('data-ttu-spoiler-img');
            const parentElement = tag.parentElement || childNode;
            parentElement.insertBefore(imgWrapper, tag);
            imgWrapper.appendChild(tag);
        };
        for (const tag of childNode.getElementsByTagName('img')) {
            if (![...tag.classList.values()].some((className) => className.includes('gaiji'))) {
                createWrapper(tag);
            }
        }
        for (const tag of childNode.getElementsByTagName('svg')) {
            if (tag.getElementsByTagName('image').length) {
                createWrapper(tag);
            }
        }
    }
    for (const tag of result.getElementsByTagName('br')) {
        const placeholderEl = document.createElement('span'); // for Firefox
        placeholderEl.classList.add('placeholder-br');
        placeholderEl.setAttribute('aria-hidden', 'true');
        placeholderEl.innerText = '〇';
        const parentElement = tag.parentElement || result;
        parentElement.insertBefore(placeholderEl, tag);
    }
    return result;
}
function relative(fromPath, toPath) {
    const fromDirName = path_browserify__WEBPACK_IMPORTED_MODULE_0___default.a.dirname(fromPath);
    const toDirName = path_browserify__WEBPACK_IMPORTED_MODULE_0___default.a.dirname(toPath);
    const toFilename = path_browserify__WEBPACK_IMPORTED_MODULE_0___default.a.basename(toPath);
    if (fromDirName === toDirName) {
        return toFilename;
    }
    const fromParts = fromDirName === '.' ? [] : fromDirName.split('/');
    const toParts = toDirName === '.' ? [] : toDirName.split('/');
    if (fromParts.length >= toParts.length) {
        for (let i = 0; i < fromParts.length; i += 1) {
            if (fromParts[i] !== toParts[i]) {
                return path_browserify__WEBPACK_IMPORTED_MODULE_0___default.a.join('../'.repeat(fromParts.length - i) + toParts.slice(i).join('/'), toFilename);
            }
        }
    }
    for (let i = 0; i < fromParts.length; i += 1) {
        if (fromParts[i] !== toParts[i]) {
            return path_browserify__WEBPACK_IMPORTED_MODULE_0___default.a.join('../'.repeat(fromParts.length - i) + toParts.slice(i).join('/'), toFilename);
        }
    }
    return path_browserify__WEBPACK_IMPORTED_MODULE_0___default.a.join(toParts.slice(fromParts.length - toParts.length).join('/'), toFilename);
}
function buildDummyBookImage(key) {
    return `data:image/gif;ttu:${key};base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==`;
}


/***/ }),

/***/ "HMgo":
/*!********************************************!*\
  !*** ./src/app/reader/reader.component.ts ***!
  \********************************************/
/*! exports provided: ReaderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReaderComponent", function() { return ReaderComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var resize_observer_polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! resize-observer-polyfill */ "bdgK");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _utils_html_fixer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/html-fixer */ "EsNf");
/* harmony import */ var _utils_smooth_scroll__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/smooth-scroll */ "dFyf");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _ebook_display_manager_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ebook-display-manager.service */ "7n3V");
/* harmony import */ var _scroll_information_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../scroll-information.service */ "wm/D");
/* harmony import */ var _bookmark_manager_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../bookmark-manager.service */ "ovA6");
/* harmony import */ var _reading_stats_manager_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../reading-stats-manager-service */ "CJaY");
/* harmony import */ var _database_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../database.service */ "c92J");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ "ofXK");















const _c0 = ["contentRef"];
const added = false;
class ReaderComponent {
    constructor(title, ebookDisplayManagerService, scrollInformationService, bookmarManagerService, readingStatsManagerService, databaseService, route, router, zone) {
        this.title = title;
        this.ebookDisplayManagerService = ebookDisplayManagerService;
        this.scrollInformationService = scrollInformationService;
        this.bookmarManagerService = bookmarManagerService;
        this.readingStatsManagerService = readingStatsManagerService;
        this.databaseService = databaseService;
        this.route = route;
        this.router = router;
        this.zone = zone;
        this.storedObjectUrls = [];
        this.updatingFontSize = false;
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
    }
    ngOnInit() {
        if (!added) {
            document.body.appendChild(this.bookmarManagerService.el);
            // document.body.appendChild(this.scrollInformationService.el);
        }
        this.contentElRef.nativeElement.appendChild(this.ebookDisplayManagerService.contentEl);
        this.zone.runOutsideAngular(() => {
            this.ebookDisplayManagerService.fontSize$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$)).subscribe((fontSize) => {
                requestAnimationFrame(() => {
                    this.updatingFontSize = true;
                    this.contentElRef.nativeElement.style.fontSize = `${fontSize}px`;
                    requestAnimationFrame(() => {
                        this.updatingFontSize = false;
                    });
                });
            });
            const wheelEventFn = Object(_utils_smooth_scroll__WEBPACK_IMPORTED_MODULE_5__["SmoothScroll"])(document.documentElement, 4);
            Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(document, 'wheel', { passive: false })
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(() => this.ebookDisplayManagerService.allowScroll), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$))
                .subscribe((ev) => {
                if (!ev.deltaY || ev.deltaX || ev.altKey || ev.shiftKey || ev.ctrlKey || ev.metaKey) {
                    return;
                }
                // https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode
                let scrollDistance;
                switch (ev.deltaMode) {
                    case 0 /* DeltaPixel */:
                        scrollDistance = ev.deltaY;
                        break;
                    case 1 /* DeltaLine */:
                        scrollDistance = ev.deltaY * this.ebookDisplayManagerService.fontSize$.value * 1.75;
                        break;
                    default:
                        scrollDistance = ev.deltaY * window.innerWidth;
                }
                wheelEventFn(-scrollDistance);
                ev.preventDefault();
            });
            Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(window, 'scroll').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$)).subscribe(() => {
                const charCount = this.scrollInformationService.calcExploredCharCount();
                this.scrollInformationService.updateScrollPercentByCharCount(this.ebookDisplayManagerService.totalCharCount, charCount);
                if (!this.updatingFontSize) {
                    this.latestScrollStats = {
                        containerWidth: this.contentElRef.nativeElement.offsetWidth,
                        exploredCharCount: charCount,
                    };
                }
            });
            const resizeObs$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["ReplaySubject"](1);
            window.addEventListener('resize', () => {
                resizeObs$.next();
            });
            this.observer = new resize_observer_polyfill__WEBPACK_IMPORTED_MODULE_1__["default"](() => {
                resizeObs$.next();
            });
            this.observer.observe(this.contentElRef.nativeElement);
            resizeObs$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["withLatestFrom"])(this.ebookDisplayManagerService.loadingFile$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(([, loadingFile]) => !loadingFile), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(() => new Promise(requestAnimationFrame)), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$)).subscribe(() => {
                this.scrollInformationService.updateParagraphPos();
                if (this.latestScrollStats && Math.abs(this.latestScrollStats.containerWidth - this.contentElRef.nativeElement.offsetWidth) > 100) {
                    const scrollPos = this.scrollInformationService.getScrollPos(this.latestScrollStats.exploredCharCount);
                    window.scrollTo(scrollPos, 0);
                }
                this.scrollInformationService.updateScrollPercent(this.ebookDisplayManagerService.totalCharCount);
                void this.bookmarManagerService.refreshBookmarkBarPosition();
            });
        });
        this.ebookDisplayManagerService.contentChanged.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$)).subscribe(() => {
            for (const el of this.ebookDisplayManagerService.contentEl.getElementsByTagName('a')) {
                el.href = document.location.pathname + el.hash;
            }
        });
        this.ebookDisplayManagerService.contentChanged.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(() => {
            const elements = this.ebookDisplayManagerService.contentEl.getElementsByTagName('a');
            const elementsArray = [...elements];
            const obs$ = elementsArray.map((el) => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(el, 'click').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])((ev) => {
                ev.preventDefault();
                ev.stopImmediatePropagation();
                return el;
            })));
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["merge"])(...obs$);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$)).subscribe((el) => {
            const targetEl = document.getElementById(el.hash.substring(1));
            if (targetEl) {
                targetEl.scrollIntoView();
            }
        });
        this.ebookDisplayManagerService.contentChanged.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(() => {
            const elements = this.ebookDisplayManagerService.contentEl.getElementsByTagName('ruby');
            const elementsArray = [...elements];
            const obs$ = elementsArray.map((el) => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(el, 'click').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])((ev) => {
                ev.preventDefault();
                ev.stopImmediatePropagation();
                return el;
            })));
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["merge"])(...obs$);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$)).subscribe((el) => {
            el.classList.add('reveal-rt');
        });
        this.ebookDisplayManagerService.contentChanged.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(() => {
            const elements = this.ebookDisplayManagerService.contentEl.querySelectorAll('[data-ttu-spoiler-img]');
            const elementsArray = [...elements];
            const obs$ = elementsArray.map((el) => {
                const spoilerLabelEl = document.createElement('span');
                spoilerLabelEl.classList.add('spoiler-label');
                spoilerLabelEl.setAttribute('aria-hidden', 'true');
                spoilerLabelEl.innerText = 'ネタバレ';
                el.appendChild(spoilerLabelEl);
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(el, 'click').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])((ev) => {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                    return [el, spoilerLabelEl];
                }));
            });
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["merge"])(...obs$);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$)).subscribe(([el, spoilerLabelEl]) => {
            el.removeChild(spoilerLabelEl);
            el.removeAttribute('data-ttu-spoiler-img');
        });
        this.ebookDisplayManagerService.contentChanged.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(() => {
            const elements = this.ebookDisplayManagerService.contentEl.getElementsByTagName('img');
            const elementsArray = [...elements];
            const obs$ = elementsArray.flatMap((imgEl) => [
                Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(imgEl, 'load'),
                Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEvent"])(imgEl, 'error'),
            ]);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["merge"])(...obs$).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["startWith"])(0), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(() => elementsArray), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["debounceTime"])(1));
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$)).subscribe((elementsArray) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            if (elementsArray.every((imgEl) => imgEl.complete)) {
                this.scrollInformationService.updateParagraphPos();
                yield this.bookmarManagerService.scrollToSavedPosition();
                this.scrollInformationService.updateScrollPercent(this.ebookDisplayManagerService.totalCharCount);
                this.ebookDisplayManagerService.loadingFile$.next(false);
            }
        }));
        Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["combineLatest"])([
            this.route.paramMap,
            this.ebookDisplayManagerService.revalidateFile.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["startWith"])(0)),
        ]).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this.destroy$)).subscribe(([paramMap]) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            this.ebookDisplayManagerService.loadingFile$.next(true);
            let canLoad = false;
            const identifier = paramMap.get('identifier');
            if (identifier) {
                const db = yield this.databaseService.db;
                const displayData = yield db.get('data', +identifier || 0);
                if (displayData) {
                    canLoad = true;
                    this.loadData(displayData);
                }
            }
            if (!canLoad) {
                this.ebookDisplayManagerService.loadingFile$.next(false);
                yield this.router.navigate([''], {
                    queryParamsHandling: 'merge',
                });
            }
        }));
    }
    ngOnDestroy() {
        this.storedObjectUrls.forEach(URL.revokeObjectURL);
        this.observer.disconnect();
        this.destroy$.next();
        this.destroy$.complete();
    }
    loadData(data) {
        this.storedObjectUrls.forEach(URL.revokeObjectURL);
        let { elementHtml } = data;
        const { title, styleSheet, blobs, } = data;
        this.title.setTitle(title.trimEnd() + ' | ッツ Ebook Reader');
        // tslint:disable-next-line:no-non-null-assertion
        this.bookmarManagerService.identifier = data.id;
        this.bookmarManagerService.el.hidden = true;
        this.readingStatsManagerService.setIdentifier(data.id);
        const urls = [];
        for (const [key, value] of Object.entries(blobs)) {
            const url = URL.createObjectURL(value);
            urls.push(url);
            elementHtml = elementHtml.
                replaceAll(Object(_utils_html_fixer__WEBPACK_IMPORTED_MODULE_4__["buildDummyBookImage"])(key), url).
                replaceAll(`ttu:${key}`, url);
        }
        const element = document.createElement('div');
        element.innerHTML = elementHtml;
        this.ebookDisplayManagerService.totalCharCount = this.ebookDisplayManagerService.getCharCount(element);
        this.scrollInformationService.initWatchParagraphs(element);
        this.ebookDisplayManagerService.updateContent(element, styleSheet);
        this.storedObjectUrls = urls;
        window.scrollTo(0, 0);
    }
}
ReaderComponent.ɵfac = function ReaderComponent_Factory(t) { return new (t || ReaderComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_7__["Title"]), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_ebook_display_manager_service__WEBPACK_IMPORTED_MODULE_8__["EbookDisplayManagerService"]), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_scroll_information_service__WEBPACK_IMPORTED_MODULE_9__["ScrollInformationService"]), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_bookmark_manager_service__WEBPACK_IMPORTED_MODULE_10__["BookmarkManagerService"]), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_reading_stats_manager_service__WEBPACK_IMPORTED_MODULE_11__["ReadingStatsManagerService"]), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_database_service__WEBPACK_IMPORTED_MODULE_12__["DatabaseService"]), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["NgZone"])); };
ReaderComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({ type: ReaderComponent, selectors: [["app-reader"]], viewQuery: function ReaderComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c0, 3);
    } if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.contentElRef = _t.first);
    } }, decls: 5, vars: 12, consts: [[1, "book-content"], ["contentRef", ""]], template: function ReaderComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](2, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](3, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](4, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("hide-spoiler-image", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](2, 6, ctx.ebookDisplayManagerService.hideSpoilerImage$))("show-spoiler-image", !_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](3, 8, ctx.ebookDisplayManagerService.hideSpoilerImage$))("hide-furigana", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](4, 10, ctx.ebookDisplayManagerService.hideFurigana$));
    } }, pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_14__["AsyncPipe"]], styles: [".book-content[_ngcontent-%COMP%] {\n  height: 90%;\n  margin: auto;\n  font-family: var(--book-font-family);\n  color: var(--font-color);\n  background: var(--background-color);\n  line-height: 1.75;\n  padding-left: 30px;\n  padding-right: 30px;\n}\n@media screen and (min-height: 780px) {\n  .book-content[_ngcontent-%COMP%] {\n    height: calc(100% - 155px);\n  }\n}\n  body {\n  overflow-y: hidden;\n}\n[_nghost-%COMP%]     *::selection {\n  background: var(--selection-background-color);\n  color: var(--selection-font-color);\n}\n[_nghost-%COMP%]     a:link {\n  color: var(--font-color) !important;\n  opacity: 0.8;\n}\n[_nghost-%COMP%]     a:hover {\n  opacity: 0.95;\n}\n[_nghost-%COMP%]     img {\n  max-height: 100%;\n}\n[_nghost-%COMP%]     ruby > rt {\n  -webkit-user-select: none;\n          user-select: none;\n}\n[_nghost-%COMP%]     .placeholder-br {\n  visibility: hidden;\n}\n.hide-spoiler-image[_ngcontent-%COMP%]     [data-ttu-spoiler-img] {\n  display: block;\n  overflow: hidden;\n  position: relative;\n  cursor: pointer;\n}\n.hide-spoiler-image[_ngcontent-%COMP%]     [data-ttu-spoiler-img] .spoiler-label {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  color: #dcddde;\n  background-color: rgba(0, 0, 0, 0.6);\n  display: inline-block;\n  padding: 12px 8px;\n  border-radius: 20px;\n  font-size: 15px;\n  font-family: \"Noto Sans JP\", sans-serif;\n  text-transform: uppercase;\n  font-weight: 700;\n}\n@media (hover: hover) {\n  .hide-spoiler-image[_ngcontent-%COMP%]     [data-ttu-spoiler-img]:hover .spoiler-label {\n    color: #ffffff;\n    background-color: rgba(0, 0, 0, 0.9);\n  }\n}\n.hide-spoiler-image[_ngcontent-%COMP%]     [data-ttu-spoiler-img] img, .hide-spoiler-image[_ngcontent-%COMP%]     [data-ttu-spoiler-img] svg {\n  filter: blur(44px);\n}\n.show-spoiler-image[_ngcontent-%COMP%]     [data-ttu-spoiler-img] .spoiler-label {\n  display: none;\n}\n.hide-furigana[_ngcontent-%COMP%]     ruby {\n  text-shadow: var(--highlight-shadow-color) 1px 0 10px !important;\n}\n.hide-furigana[_ngcontent-%COMP%]     rb {\n  text-shadow: inherit !important;\n}\n.hide-furigana[_ngcontent-%COMP%]     ruby rt {\n  visibility: hidden;\n}\n@media (hover: hover) {\n  .hide-furigana[_ngcontent-%COMP%]     ruby:hover rt {\n    visibility: visible;\n  }\n}\n.hide-furigana[_ngcontent-%COMP%]     ruby.reveal-rt {\n  text-shadow: none !important;\n}\n.hide-furigana[_ngcontent-%COMP%]     ruby.reveal-rt rt {\n  visibility: visible;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3JlYWRlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFVQTtFQVRFLFdBQUE7RUFXQSxZQUFBO0VBQ0Esb0NBQUE7RUFDQSx3QkFBQTtFQUNBLG1DQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0FBVEY7QUFORTtFQU9GO0lBTkksMEJBQUE7RUFTRjtBQUNGO0FBUUU7RUFDRSxrQkFBQTtBQUxKO0FBVUU7RUFDRSw2Q0FBQTtFQUNBLGtDQUFBO0FBUEo7QUFVRTtFQUNFLG1DQUFBO0VBQ0EsWUFBQTtBQVJKO0FBV0U7RUFDRSxhQUFBO0FBVEo7QUFZRTtFQUNFLGdCQUFBO0FBVko7QUFhRTtFQUNFLHlCQUFBO1VBQUEsaUJBQUE7QUFYSjtBQWNFO0VBQ0Usa0JBQUE7QUFaSjtBQWtCSTtFQUNFLGNBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZUFBQTtBQWZOO0FBaUJNO0VBQ0Usa0JBQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLGdDQUFBO0VBQ0EsY0FBQTtFQUNBLG9DQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLHVDQUFBO0VBQ0EseUJBQUE7RUFDQSxnQkFBQTtBQWZSO0FBa0JNO0VBQ0U7SUFDRSxjQUFBO0lBQ0Esb0NBQUE7RUFoQlI7QUFDRjtBQW1CTTtFQUVFLGtCQUFBO0FBbEJSO0FBMkJNO0VBQ0UsYUFBQTtBQXhCUjtBQWdDSTtFQUNFLGdFQUFBO0FBN0JOO0FBZ0NJO0VBQ0UsK0JBQUE7QUE5Qk47QUFrQ007RUFDRSxrQkFBQTtBQWhDUjtBQW1DTTtFQUVJO0lBQ0UsbUJBQUE7RUFsQ1Y7QUFDRjtBQXNDTTtFQUNFLDRCQUFBO0FBcENSO0FBc0NRO0VBQ0UsbUJBQUE7QUFwQ1YiLCJmaWxlIjoicmVhZGVyLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQG1peGluIHNldEhlaWdodCgkaGVpZ2h0UHJvcGVydHkpIHtcbiAgI3skaGVpZ2h0UHJvcGVydHl9OiA5MCU7XG5cbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi1oZWlnaHQ6IDc4MHB4KSB7XG4gICAgI3skaGVpZ2h0UHJvcGVydHl9OiBjYWxjKDEwMCUgLSAxNTVweCk7XG4gIH1cblxufVxuXG5cbi5ib29rLWNvbnRlbnQge1xuICBAaW5jbHVkZSBzZXRIZWlnaHQoXCJoZWlnaHRcIik7XG4gIG1hcmdpbjogYXV0bztcbiAgZm9udC1mYW1pbHk6IHZhcigtLWJvb2stZm9udC1mYW1pbHkpO1xuICBjb2xvcjogdmFyKC0tZm9udC1jb2xvcik7XG4gIGJhY2tncm91bmQ6IHZhcigtLWJhY2tncm91bmQtY29sb3IpO1xuICBsaW5lLWhlaWdodDogMS43NTtcbiAgcGFkZGluZy1sZWZ0OiAzMHB4O1xuICBwYWRkaW5nLXJpZ2h0OiAzMHB4O1xufVxuXG46Om5nLWRlZXAge1xuICBib2R5IHtcbiAgICBvdmVyZmxvdy15OiBoaWRkZW47IC8vIEJlY2F1c2UgQ2hyb21lIGRvZXNuJ3QgYnJlYWsgZG93biAn44CA44CAJywgYW5kIG92ZXJmbG93IHRoZSBjb250YWluZXJcbiAgfVxufVxuXG46aG9zdCA6Om5nLWRlZXAge1xuICAqOjpzZWxlY3Rpb24ge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXNlbGVjdGlvbi1iYWNrZ3JvdW5kLWNvbG9yKTtcbiAgICBjb2xvcjogdmFyKC0tc2VsZWN0aW9uLWZvbnQtY29sb3IpO1xuICB9XG5cbiAgYTpsaW5rIHtcbiAgICBjb2xvcjogdmFyKC0tZm9udC1jb2xvcikgIWltcG9ydGFudDtcbiAgICBvcGFjaXR5OiAuODtcbiAgfVxuXG4gIGE6aG92ZXIge1xuICAgIG9wYWNpdHk6IC45NTtcbiAgfVxuXG4gIGltZyB7XG4gICAgbWF4LWhlaWdodDogMTAwJTtcbiAgfVxuXG4gIHJ1YnkgPiBydCB7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIH1cblxuICAucGxhY2Vob2xkZXItYnIge1xuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgfVxufVxuXG4uaGlkZS1zcG9pbGVyLWltYWdlIHtcbiAgOjpuZy1kZWVwIHtcbiAgICBbZGF0YS10dHUtc3BvaWxlci1pbWddIHtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgJiAuc3BvaWxlci1sYWJlbCB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdG9wOiA1MCU7XG4gICAgICAgIGxlZnQ6IDUwJTtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gICAgICAgIGNvbG9yOiAjZGNkZGRlO1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsMCwwLC42KTtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICBwYWRkaW5nOiAxMnB4IDhweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcbiAgICAgICAgZm9udC1zaXplOiAxNXB4O1xuICAgICAgICBmb250LWZhbWlseTogXCJOb3RvIFNhbnMgSlBcIiwgc2Fucy1zZXJpZjtcbiAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgIH1cblxuICAgICAgQG1lZGlhIChob3ZlcjogaG92ZXIpIHtcbiAgICAgICAgJjpob3ZlciAuc3BvaWxlci1sYWJlbCB7XG4gICAgICAgICAgY29sb3I6ICNmZmZmZmY7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwuOSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJiBpbWcsXG4gICAgICAmIHN2Zywge1xuICAgICAgICBmaWx0ZXI6IGJsdXIoNDRweCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi5zaG93LXNwb2lsZXItaW1hZ2Uge1xuICA6Om5nLWRlZXAge1xuICAgIFtkYXRhLXR0dS1zcG9pbGVyLWltZ10ge1xuICAgICAgLnNwb2lsZXItbGFiZWwge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4uaGlkZS1mdXJpZ2FuYSB7XG4gIDo6bmctZGVlcCB7XG4gICAgcnVieSB7XG4gICAgICB0ZXh0LXNoYWRvdzogdmFyKC0taGlnaGxpZ2h0LXNoYWRvdy1jb2xvcikgMXB4IDAgMTBweCAhaW1wb3J0YW50O1xuICAgIH1cblxuICAgIHJiIHtcbiAgICAgIHRleHQtc2hhZG93OiBpbmhlcml0ICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgcnVieSB7XG4gICAgICBydCB7XG4gICAgICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgICAgIH1cblxuICAgICAgQG1lZGlhIChob3ZlcjogaG92ZXIpIHtcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgcnQge1xuICAgICAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJi5yZXZlYWwtcnQge1xuICAgICAgICB0ZXh0LXNoYWRvdzogbm9uZSAhaW1wb3J0YW50O1xuXG4gICAgICAgIHJ0IHtcbiAgICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0= */"] });


/***/ }),

/***/ "PyU3":
/*!**************************************************************!*\
  !*** ./src/app/settings-dialog/settings-dialog.component.ts ***!
  \**************************************************************/
/*! exports provided: SettingsDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsDialogComponent", function() { return SettingsDialogComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _fortawesome_free_solid_svg_icons_faMinus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons/faMinus */ "7/K8");
/* harmony import */ var _fortawesome_free_solid_svg_icons_faMinus__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_solid_svg_icons_faMinus__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _fortawesome_free_solid_svg_icons_faPlus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons/faPlus */ "DuTs");
/* harmony import */ var _fortawesome_free_solid_svg_icons_faPlus__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_solid_svg_icons_faPlus__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _theme_manager_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../theme-manager.service */ "kjHl");
/* harmony import */ var _ebook_display_manager_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ebook-display-manager.service */ "7n3V");
/* harmony import */ var _ui_settings_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ui-settings-service */ "ZJAV");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "6NWb");
/**
 * @licence
 * Copyright (c) 2021, ッツ Reader Authors
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */









function SettingsDialogComponent_button_7_Template(rf, ctx) { if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsDialogComponent_button_7_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4); const i_r2 = ctx.index; const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](); return ctx_r3.onThemeUpdateClick(i_r2); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " \u3041\u3042 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const theme_r1 = ctx.$implicit;
    const i_r2 = ctx.index;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassMapInterpolate1"]("button button-styling theme-button ", theme_r1, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", ctx_r0.themeManagerService.themeIndex === i_r2);
} }
class SettingsDialogComponent {
    constructor(themeManagerService, ebookDisplayManagerService, uiSettingsService, cdr) {
        this.themeManagerService = themeManagerService;
        this.ebookDisplayManagerService = ebookDisplayManagerService;
        this.uiSettingsService = uiSettingsService;
        this.cdr = cdr;
        this.closeClick = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.faMinus = _fortawesome_free_solid_svg_icons_faMinus__WEBPACK_IMPORTED_MODULE_1__["faMinus"];
        this.faPlus = _fortawesome_free_solid_svg_icons_faPlus__WEBPACK_IMPORTED_MODULE_2__["faPlus"];
    }
    ngOnInit() {
    }
    onFontSizeUpdateClick(offset) {
        this.ebookDisplayManagerService.fontSize$.next(this.ebookDisplayManagerService.fontSize$.value + offset);
        this.cdr.markForCheck();
    }
    onThemeUpdateClick(i) {
        this.themeManagerService.setTheme(i);
        this.cdr.markForCheck();
    }
    onHideSpoilerImageClick() {
        this.ebookDisplayManagerService.hideSpoilerImage$.next(!this.ebookDisplayManagerService.hideSpoilerImage$.value);
        this.cdr.markForCheck();
    }
    onHideFuriganaClick() {
        this.ebookDisplayManagerService.hideFurigana$.next(!this.ebookDisplayManagerService.hideFurigana$.value);
        this.cdr.markForCheck();
    }
    onShowTooltipsClick() {
        this.uiSettingsService.showTooltips$.next(!this.uiSettingsService.showTooltips$.value);
        this.cdr.markForCheck();
    }
}
SettingsDialogComponent.ɵfac = function SettingsDialogComponent_Factory(t) { return new (t || SettingsDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_theme_manager_service__WEBPACK_IMPORTED_MODULE_3__["ThemeManagerService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ebook_display_manager_service__WEBPACK_IMPORTED_MODULE_4__["EbookDisplayManagerService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ui_settings_service__WEBPACK_IMPORTED_MODULE_5__["UiSettingsService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"])); };
SettingsDialogComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: SettingsDialogComponent, selectors: [["app-settings-dialog"]], outputs: { closeClick: "closeClick" }, decls: 37, vars: 18, consts: [[1, "dialog-padding"], [1, "dialog-header"], [1, "item-header"], [1, "button-row"], [3, "active", "class", "click", 4, "ngFor", "ngForOf"], [1, "button", "button-styling", "icon-button", 3, "icon", "click"], [1, "label-button", "button-styling"], [1, "label-button", "button-styling", "clickable-button", 3, "click"], [1, "dialog-footer"], ["type", "button", 1, "button", "label-button", "button-styling", 3, "click"], [3, "click"]], template: function SettingsDialogComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "header", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "Settings");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "div");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Theme");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, SettingsDialogComponent_button_7_Template, 2, 5, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Font Size");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "fa-icon", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsDialogComponent_Template_fa_icon_click_11_listener() { return ctx.onFontSizeUpdateClick(-1); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](14, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "fa-icon", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsDialogComponent_Template_fa_icon_click_15_listener() { return ctx.onFontSizeUpdateClick(1); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, "Blur Images (In case of spoiler)");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsDialogComponent_Template_span_click_19_listener() { return ctx.onHideSpoilerImageClick(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](20, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](21, "ON");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](22, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, "Hide furigana");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsDialogComponent_Template_span_click_25_listener() { return ctx.onHideFuriganaClick(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](26, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, "ON");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, "Show Tooltips");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsDialogComponent_Template_span_click_31_listener() { return ctx.onShowTooltipsClick(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](32, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](33, "ON");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](34, "footer", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function SettingsDialogComponent_Template_button_click_35_listener() { return ctx.closeClick.emit(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, "Close");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.themeManagerService.availableThemes);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", ctx.faMinus);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](14, 10, ctx.ebookDisplayManagerService.fontSize$), "px");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("icon", ctx.faPlus);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](20, 12, ctx.ebookDisplayManagerService.hideSpoilerImage$));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](26, 14, ctx.ebookDisplayManagerService.hideFurigana$));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](32, 16, ctx.uiSettingsService.showTooltips$));
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["NgForOf"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_7__["FaIconComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_6__["AsyncPipe"]], styles: ["[_nghost-%COMP%] {\n  display: block;\n  border-radius: 6px;\n  width: 600px;\n  max-width: 90vw;\n  color: #222222;\n  background-color: #ffffff;\n  writing-mode: horizontal-tb;\n  font-size: 16px;\n  max-height: 90%;\n  overflow-y: auto;\n}\n\n.dialog-padding[_ngcontent-%COMP%] {\n  padding: 16px;\n}\n\n.dialog-header[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n  font-weight: 900;\n  font-size: 1.5em;\n}\n\n.item-header[_ngcontent-%COMP%] {\n  margin-bottom: 8px;\n  font-size: 1.2em;\n  font-weight: bold;\n}\n\n.button-row[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n}\n\n.dialog-footer[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  margin-top: 16px;\n}\n\n.button[_ngcontent-%COMP%] {\n  color: #222222;\n  outline: none;\n  background-color: #ffffff;\n  cursor: pointer;\n}\n\n.button[_ngcontent-%COMP%]:focus {\n  outline: none;\n}\n\n.button-styling[_ngcontent-%COMP%] {\n  font-size: 1.25em;\n  padding: 8px;\n  border: 2px solid #dddddd;\n}\n\n.button-styling.active[_ngcontent-%COMP%] {\n  border-color: #4baae0;\n}\n\n.button-styling[_ngcontent-%COMP%]:hover {\n  border-color: #222222;\n}\n\n.theme-button[_ngcontent-%COMP%] {\n  color: var(--font-color);\n  background-color: var(--background-color);\n  font-size: 30px;\n  box-shadow: inset 0 0 0 1px #ffffff;\n}\n\n.button-row[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.label-button[_ngcontent-%COMP%] {\n  display: inline-block;\n  vertical-align: bottom;\n}\n\n.icon-button[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  font-size: 10px;\n}\n\n.clickable-button[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NldHRpbmdzLWRpYWxvZy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGNBQUE7RUFDQSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsY0FBQTtFQUNBLHlCQUFBO0VBQ0EsMkJBQUE7RUFDQSxlQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxhQUFBO0FBQ0Y7O0FBRUE7RUFDRSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7QUFDRjs7QUFFQTtFQUNFLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtBQUNGOztBQUVBO0VBQ0UsbUJBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7RUFDQSx5QkFBQTtFQUNBLGdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxjQUFBO0VBQ0EsYUFBQTtFQUNBLHlCQUFBO0VBQ0EsZUFBQTtBQUNGOztBQUNFO0VBQ0UsYUFBQTtBQUNKOztBQUdBO0VBQ0UsaUJBQUE7RUFDQSxZQUFBO0VBQ0EseUJBQUE7QUFBRjs7QUFFRTtFQUNFLHFCQUFBO0FBQUo7O0FBR0U7RUFDRSxxQkFBQTtBQURKOztBQUtBO0VBQ0Usd0JBQUE7RUFDQSx5Q0FBQTtFQUNBLGVBQUE7RUFDQSxtQ0FBQTtBQUZGOztBQUtBO0VBQ0UsYUFBQTtFQUNBLGVBQUE7QUFGRjs7QUFLQTtFQUNFLHFCQUFBO0VBQ0Esc0JBQUE7QUFGRjs7QUFLQTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGVBQUE7QUFGRjs7QUFLQTtFQUNFLGVBQUE7QUFGRiIsImZpbGUiOiJzZXR0aW5ncy1kaWFsb2cuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIHdpZHRoOiA2MDBweDtcbiAgbWF4LXdpZHRoOiA5MHZ3O1xuICBjb2xvcjogIzIyMjIyMjtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbiAgd3JpdGluZy1tb2RlOiBob3Jpem9udGFsLXRiO1xuICBmb250LXNpemU6IDE2cHg7XG4gIG1heC1oZWlnaHQ6IDkwJTtcbiAgb3ZlcmZsb3cteTogYXV0bztcbn1cblxuLmRpYWxvZy1wYWRkaW5nIHtcbiAgcGFkZGluZzogMTZweDtcbn1cblxuLmRpYWxvZy1oZWFkZXIge1xuICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICBmb250LXdlaWdodDogOTAwO1xuICBmb250LXNpemU6IDEuNWVtO1xufVxuXG4uaXRlbS1oZWFkZXIge1xuICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gIGZvbnQtc2l6ZTogMS4yZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4uYnV0dG9uLXJvdyB7XG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG59XG5cbi5kaWFsb2ctZm9vdGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgbWFyZ2luLXRvcDogMTZweDtcbn1cblxuLmJ1dHRvbiB7XG4gIGNvbG9yOiAjMjIyMjIyO1xuICBvdXRsaW5lOiBub25lO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xuICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgJjpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgfVxufVxuXG4uYnV0dG9uLXN0eWxpbmcge1xuICBmb250LXNpemU6IDEuMjVlbTtcbiAgcGFkZGluZzogOHB4O1xuICBib3JkZXI6IDJweCBzb2xpZCAjZGRkZGRkO1xuXG4gICYuYWN0aXZlIHtcbiAgICBib3JkZXItY29sb3I6ICM0YmFhZTA7XG4gIH1cblxuICAmOmhvdmVyIHtcbiAgICBib3JkZXItY29sb3I6ICMyMjIyMjI7XG4gIH1cbn1cblxuLnRoZW1lLWJ1dHRvbiB7XG4gIGNvbG9yOiB2YXIoLS1mb250LWNvbG9yKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1jb2xvcik7XG4gIGZvbnQtc2l6ZTogMzBweDtcbiAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMXB4ICNmZmZmZmY7XG59XG5cbi5idXR0b24tcm93IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiB3cmFwO1xufVxuXG4ubGFiZWwtYnV0dG9uIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB2ZXJ0aWNhbC1hbGlnbjogYm90dG9tO1xufVxuXG4uaWNvbi1idXR0b24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBmb250LXNpemU6IDEwcHg7XG59XG5cbi5jbGlja2FibGUtYnV0dG9uIHtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuIl19 */"] });


/***/ }),

/***/ "RoRh":
/*!************************************!*\
  !*** ./src/app/utils/extractor.ts ***!
  \************************************/
/*! exports provided: HtmlzExtractor, EpubExtractor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HtmlzExtractor", function() { return HtmlzExtractor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EpubExtractor", function() { return EpubExtractor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @zip.js/zip.js */ "Cdqh");
/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fast-xml-parser */ "elGS");
/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fast_xml_parser__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var path_browserify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path-browserify */ "33yf");
/* harmony import */ var path_browserify__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path_browserify__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ua_parser_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ua-parser-js */ "K4CH");
/* harmony import */ var ua_parser_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ua_parser_js__WEBPACK_IMPORTED_MODULE_4__);
/**
 * @licence
 * Copyright (c) 2021, ッツ Reader Authors
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */





const parseResult = new ua_parser_js__WEBPACK_IMPORTED_MODULE_4__["UAParser"](window.navigator.userAgent).getResult();
const isKiwiBrowser = parseResult.os.name === 'Android' && parseResult.browser.name === 'Chrome';
_zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__["configure"]({
    useWebWorkers: !isKiwiBrowser,
});
class HtmlzExtractor {
    extract(blob) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const reader = new _zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__["ZipReader"](new _zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__["BlobReader"](blob));
            // get all entries from the zip
            const entries = yield reader.getEntries();
            const result = {};
            if (entries.length) {
                yield Promise.all(entries.map((entry) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                    if (entry.getData && !entry.directory) {
                        let value;
                        switch (entry.filename) {
                            case 'index.html':
                            case 'metadata.opf':
                            case 'style.css':
                                value = yield entry.getData(new _zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__["TextWriter"]());
                                break;
                            default: {
                                value = yield entry.getData(new _zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__["BlobWriter"](getMimeTypeFromName(entry.filename)));
                            }
                        }
                        result[entry.filename] = value;
                    }
                })));
            }
            // close the ZipReader
            yield reader.close();
            return result;
        });
    }
}
class EpubExtractor {
    extract(blob) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const reader = new _zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__["ZipReader"](new _zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__["BlobReader"](blob));
            // get all entries from the zip
            const entries = yield reader.getEntries();
            const result = {};
            let contentsDirectory = '';
            let contents;
            if (entries.length) {
                const fileMap = entries.reduce((acc, cur) => {
                    acc[cur.filename] = cur;
                    return acc;
                }, {});
                // tslint:disable-next-line:no-non-null-assertion
                const containerXml = yield fileMap['META-INF/container.xml'].getData(new _zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__["TextWriter"]());
                const container = fast_xml_parser__WEBPACK_IMPORTED_MODULE_2__["parse"](containerXml, {
                    ignoreAttributes: false,
                });
                const rootFiles = container.container.rootfiles.rootfile;
                const rootFile = Array.isArray(rootFiles) ? rootFiles[0] : rootFiles;
                const contentOpfFilename = rootFile['@_full-path'];
                // tslint:disable-next-line:no-non-null-assertion
                const contentsXml = yield fileMap[contentOpfFilename].getData(new _zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__["TextWriter"]());
                result[contentOpfFilename] = contentsXml;
                contentsDirectory = path_browserify__WEBPACK_IMPORTED_MODULE_3___default.a.dirname(contentOpfFilename);
                contents = fast_xml_parser__WEBPACK_IMPORTED_MODULE_2__["parse"](contentsXml, {
                    ignoreAttributes: false,
                });
                yield Promise.all(contents.package.manifest.item.map((item) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                    const fileRelativePath = item['@_href'];
                    const entry = fileMap[path_browserify__WEBPACK_IMPORTED_MODULE_3___default.a.join(contentsDirectory, fileRelativePath)];
                    if (entry.getData && !entry.directory) {
                        let value;
                        const mediaType = item['@_media-type'];
                        if (mediaType.startsWith('image/')) {
                            value = yield entry.getData(new _zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__["BlobWriter"](mediaType));
                        }
                        else {
                            value = yield entry.getData(new _zip_js_zip_js__WEBPACK_IMPORTED_MODULE_1__["TextWriter"]());
                        }
                        result[fileRelativePath] = value;
                    }
                })));
            }
            yield reader.close();
            return {
                contentsDirectory,
                contents,
                result,
            };
        });
    }
}
function getMimeTypeFromName(filename) {
    // image/gif, image/png, image/jpeg, image/bmp, image/webp
    const regexResult = /.*\.([^.]+)$/.exec(filename);
    if (regexResult) {
        switch (regexResult[1].toLowerCase()) {
            case 'gif':
                return 'image/gif';
            case 'png':
                return 'image/png';
            case 'jpg':
            case 'jpeg':
            case 'jfif':
            case 'jfi':
                return 'image/jpeg';
            case 'bmp':
                return 'image/bmp';
            case 'webp':
                return 'image/webp';
        }
    }
    return undefined;
}


/***/ }),

/***/ "SQCl":
/*!*************************************!*\
  !*** ./src/app/utils/css-parser.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var balanced_match__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! balanced-match */ "kbA8");
/* harmony import */ var balanced_match__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(balanced_match__WEBPACK_IMPORTED_MODULE_0__);
// @ts-nocheck
/* tslint:disable */
/**
 * Based on css parser/compiler by NxChg
 * https://github.com/NxtChg/pieces/tree/master/js/css_parser
 */
// Dependencies
// =============================================================================

// Functions
// =============================================================================
/**
 * Parses CSS string and generates AST object
 *
 * @param {string}  css The CSS stringt to be converted to an AST
 * @param {object}  [options] Options object
 * @param {boolean} [options.preserveStatic=true] Determines if CSS
 *                  declarations that do not reference a custom property will
 *                  be preserved in the transformed CSS
 * @param {boolean} [options.removeComments=false] Remove comments from returned
 *                  object
 * @returns {object}
 */
function parseCss(css, options = {}) {
    const defaults = {
        preserveStatic: true,
        removeComments: false
    };
    const settings = Object.assign({}, defaults, options);
    const errors = [];
    // Errors
    // -------------------------------------------------------------------------
    function error(msg) {
        throw new Error(`CSS parse error: ${msg}`);
    }
    // RegEx
    // -------------------------------------------------------------------------
    // Match regexp and return captures
    function match(re) {
        const m = re.exec(css);
        if (m) {
            css = css.slice(m[0].length);
            return m;
        }
    }
    function open() {
        return match(/^{\s*/);
    }
    function close() {
        return match(/^}/);
    }
    function whitespace() {
        match(/^\s*/);
    }
    // Comments
    // -------------------------------------------------------------------------
    function comment() {
        whitespace();
        if (css[0] !== '/' || css[1] !== '*') {
            return;
        }
        let i = 2;
        while (css[i] && (css[i] !== '*' || css[i + 1] !== '/')) {
            i++;
        }
        if (!css[i]) {
            return error('end of comment is missing');
        }
        const str = css.slice(2, i);
        css = css.slice(i + 2);
        return {
            type: 'comment',
            comment: str
        };
    }
    function comments() {
        const cmnts = [];
        let c;
        while ((c = comment())) {
            cmnts.push(c);
        }
        return settings.removeComments ? [] : cmnts;
    }
    // Selector
    // -------------------------------------------------------------------------
    function selector() {
        whitespace();
        while (css[0] === '}') {
            error('extra closing bracket');
        }
        const m = match(/^(("(?:\\"|[^"])*"|'(?:\\'|[^'])*'|[^{])+)/);
        if (m) {
            return m[0]
                .trim() // remove all comments from selectors
                .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '')
                .replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function (m) {
                return m.replace(/,/g, '\u200C');
            })
                .split(/\s*(?![^(]*\)),\s*/)
                .map(function (s) {
                return s.replace(/\u200C/g, ',');
            });
        }
    }
    // Declarations
    // -------------------------------------------------------------------------
    function declaration() {
        // Nested @ rule(s)
        if (css[0] === '@') {
            return at_rule();
        }
        match(/^([;\s]*)+/); // ignore empty declarations + whitespace
        const comment_regexp = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
        let prop = match(/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
        if (!prop) {
            return;
        }
        prop = prop[0].trim();
        if (!match(/^:\s*/)) {
            return error('property missing \':\'');
        }
        // Quotes regex repeats verbatim inside and outside parentheses
        const val = match(/^((?:\/\*.*?\*\/|'(?:\\'|.)*?'|"(?:\\"|.)*?"|\((\s*'(?:\\'|.)*?'|"(?:\\"|.)*?"|[^)]*?)\s*\)|[^};])+)/);
        const ret = {
            type: 'declaration',
            property: prop.replace(comment_regexp, ''),
            value: val ? val[0].replace(comment_regexp, '').trim() : ''
        };
        match(/^[;\s]*/);
        return ret;
    }
    function declarations() {
        if (!open()) {
            return error('missing \'{\'');
        }
        let d;
        let decls = comments();
        while ((d = declaration())) {
            decls.push(d);
            decls = decls.concat(comments());
        }
        if (!close()) {
            return error('missing \'}\'');
        }
        return decls;
    }
    // Keyframes
    // -------------------------------------------------------------------------
    function keyframe() {
        whitespace();
        const vals = [];
        let m;
        while ((m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/))) {
            vals.push(m[1]);
            match(/^,\s*/);
        }
        if (vals.length) {
            return {
                type: 'keyframe',
                values: vals,
                declarations: declarations()
            };
        }
    }
    function at_keyframes() {
        let m = match(/^@([-\w]+)?keyframes\s*/);
        if (!m) {
            return;
        }
        const vendor = m[1];
        m = match(/^([-\w]+)\s*/);
        if (!m) {
            return error('@keyframes missing name');
        }
        const name = m[1];
        if (!open()) {
            return error('@keyframes missing \'{\'');
        }
        let frame;
        let frames = comments();
        while ((frame = keyframe())) {
            frames.push(frame);
            frames = frames.concat(comments());
        }
        if (!close()) {
            return error('@keyframes missing \'}\'');
        }
        return {
            type: 'keyframes',
            name: name,
            vendor: vendor,
            keyframes: frames
        };
    }
    // @ Rules
    // -------------------------------------------------------------------------
    function at_page() {
        const m = match(/^@page */);
        if (m) {
            const sel = selector() || [];
            return { type: 'page', selectors: sel, declarations: declarations() };
        }
    }
    function at_page_margin_box() {
        const m = match(/@(top|bottom|left|right)-(left|center|right|top|middle|bottom)-?(corner)?\s*/);
        if (m) {
            const name = `${m[1]}-${m[2]}` + (m[3] ? `-${m[3]}` : '');
            return { type: 'page-margin-box', name, declarations: declarations() };
        }
    }
    function at_fontface() {
        const m = match(/^@font-face\s*/);
        if (m) {
            return { type: 'font-face', declarations: declarations() };
        }
    }
    function at_supports() {
        const m = match(/^@supports *([^{]+)/);
        if (m) {
            return { type: 'supports', supports: m[1].trim(), rules: rules() };
        }
    }
    function at_host() {
        const m = match(/^@host\s*/);
        if (m) {
            return { type: 'host', rules: rules() };
        }
    }
    function at_media() {
        const m = match(/^@media([^{]+)*/);
        if (m) {
            return { type: 'media', media: (m[1] || '').trim(), rules: rules() };
        }
    }
    function at_custom_m() {
        const m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
        if (m) {
            return { type: 'custom-media', name: m[1].trim(), media: m[2].trim() };
        }
    }
    function at_document() {
        const m = match(/^@([-\w]+)?document *([^{]+)/);
        if (m) {
            return { type: 'document', document: m[2].trim(), vendor: m[1] ? m[1].trim() : null, rules: rules() };
        }
    }
    function at_x() {
        const m = match(/^@(import|charset|namespace)\s*([^;]+);/);
        if (m) {
            return { type: m[1], name: m[2].trim() };
        }
    }
    function at_rule() {
        whitespace();
        if (css[0] === '@') {
            const ret = at_x() ||
                at_fontface() ||
                at_media() ||
                at_keyframes() ||
                at_supports() ||
                at_document() ||
                at_custom_m() ||
                at_host() ||
                at_page() ||
                at_page_margin_box(); // Must be last
            if (ret && !settings.preserveStatic) {
                let hasVarFunc = false;
                // @page, @font-face
                if (ret.declarations) {
                    hasVarFunc = ret.declarations.some(decl => /var\(/.test(decl.value));
                }
                // @keyframes, @media, @supports, etc.
                else {
                    const arr = ret.keyframes || ret.rules || [];
                    hasVarFunc = arr.some(obj => (obj.declarations || []).some(decl => /var\(/.test(decl.value)));
                }
                return hasVarFunc ? ret : {};
            }
            return ret;
        }
    }
    // Rules
    // -------------------------------------------------------------------------
    function rule() {
        if (!settings.preserveStatic) {
            const balancedMatch = balanced_match__WEBPACK_IMPORTED_MODULE_0___default()('{', '}', css);
            // Skip rulset if it does not contain a root/host variable
            // declaration or a variable function value
            if (balancedMatch) {
                const hasVarDecl = /:(?:root|host)(?![.:#(])/.test(balancedMatch.pre) && /--\S*\s*:/.test(balancedMatch.body);
                const hasVarFunc = /var\(/.test(balancedMatch.body);
                if (!hasVarDecl && !hasVarFunc) {
                    css = css.slice(balancedMatch.end + 1);
                    return {};
                }
            }
        }
        const sel = selector() || [];
        const decls = settings.preserveStatic ? declarations() : declarations().filter(decl => {
            const hasVarDecl = sel.some(s => /:(?:root|host)(?![.:#(])/.test(s)) && /^--\S/.test(decl.property);
            const hasVarFunc = /var\(/.test(decl.value);
            return hasVarDecl || hasVarFunc;
        });
        if (!sel.length) {
            error('selector missing');
        }
        return {
            type: 'rule',
            selectors: sel,
            declarations: decls
        };
    }
    function rules(core) {
        if (!core && !open()) {
            return error('missing \'{\'');
        }
        let node;
        let rules = comments();
        while (css.length && (core || css[0] !== '}') && (node = at_rule() || rule())) {
            if (node.type) {
                rules.push(node);
            }
            rules = rules.concat(comments());
        }
        if (!core && !close()) {
            return error('missing \'}\'');
        }
        return rules;
    }
    return {
        type: 'stylesheet',
        stylesheet: {
            rules: rules(true),
            errors: errors
        }
    };
}
// Exports
// =============================================================================
/* harmony default export */ __webpack_exports__["default"] = (parseCss);


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _fortawesome_free_regular_svg_icons_faBookmark__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/free-regular-svg-icons/faBookmark */ "LsDs");
/* harmony import */ var _fortawesome_free_regular_svg_icons_faBookmark__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_regular_svg_icons_faBookmark__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fortawesome_free_solid_svg_icons_faCog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons/faCog */ "esdX");
/* harmony import */ var _fortawesome_free_solid_svg_icons_faCog__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_solid_svg_icons_faCog__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _fortawesome_free_solid_svg_icons_faEraser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons/faEraser */ "Rmph");
/* harmony import */ var _fortawesome_free_solid_svg_icons_faEraser__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_solid_svg_icons_faEraser__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _fortawesome_free_solid_svg_icons_faExpand__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons/faExpand */ "P/zL");
/* harmony import */ var _fortawesome_free_solid_svg_icons_faExpand__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_solid_svg_icons_faExpand__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _fortawesome_free_solid_svg_icons_faFileMedical__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons/faFileMedical */ "EwxJ");
/* harmony import */ var _fortawesome_free_solid_svg_icons_faFileMedical__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_solid_svg_icons_faFileMedical__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _fortawesome_free_solid_svg_icons_faFolderPlus__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons/faFolderPlus */ "HxkP");
/* harmony import */ var _fortawesome_free_solid_svg_icons_faFolderPlus__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_solid_svg_icons_faFolderPlus__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _fortawesome_free_solid_svg_icons_faRuler__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons/faRuler */ "PwSy");
/* harmony import */ var _fortawesome_free_solid_svg_icons_faRuler__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_solid_svg_icons_faRuler__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _fortawesome_free_solid_svg_icons_faSyncAlt__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fortawesome/free-solid-svg-icons/faSyncAlt */ "4AUc");
/* harmony import */ var _fortawesome_free_solid_svg_icons_faSyncAlt__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_fortawesome_free_solid_svg_icons_faSyncAlt__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! fast-xml-parser */ "elGS");
/* harmony import */ var fast_xml_parser__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(fast_xml_parser__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _utils_css_parser__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./utils/css-parser */ "SQCl");
/* harmony import */ var _utils_css_stringify__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./utils/css-stringify */ "hXrI");
/* harmony import */ var _utils_extractor__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./utils/extractor */ "RoRh");
/* harmony import */ var _utils_html_fixer__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./utils/html-fixer */ "EsNf");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _auto_scroller_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./auto-scroller.service */ "0eCp");
/* harmony import */ var _bookmark_manager_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./bookmark-manager.service */ "ovA6");
/* harmony import */ var _ebook_display_manager_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./ebook-display-manager.service */ "7n3V");
/* harmony import */ var _reading_stats_manager_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./reading-stats-manager-service */ "CJaY");
/* harmony import */ var _ui_settings_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./ui-settings-service */ "ZJAV");
/* harmony import */ var _scroll_information_service__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./scroll-information.service */ "wm/D");
/* harmony import */ var _theme_manager_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./theme-manager.service */ "kjHl");
/* harmony import */ var _database_service__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./database.service */ "c92J");
/* harmony import */ var _angular_service_worker__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/service-worker */ "Jho9");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "6NWb");
/* harmony import */ var _settings_dialog_settings_dialog_component__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./settings-dialog/settings-dialog.component */ "PyU3");































const _c0 = function (a0) { return { "hide": a0 }; };
function AppComponent_ng_container_1_div_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](1, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](2, "Auto");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](2, _c0, !ctx_r7.showUi));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate1"](" (", ctx_r7.autoScrollerService.multiplier, "x) ");
} }
const _c1 = function (a0) { return { "tooltip bottom-center": a0 }; };
function AppComponent_ng_container_1_fa_icon_3_Template(rf, ctx) { if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "fa-icon", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function AppComponent_ng_container_1_fa_icon_3_Template_fa_icon_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r14); const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2); return ctx_r13.readingStatsManagerService.saveStartingCharCount(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](4, _c1, _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](1, 2, ctx_r8.uiSettingsService.showTooltips$)))("icon", ctx_r8.faRuler);
} }
function AppComponent_ng_container_1_fa_icon_5_Template(rf, ctx) { if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "fa-icon", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function AppComponent_ng_container_1_fa_icon_5_Template_fa_icon_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r16); const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2); return ctx_r15.readingStatsManagerService.clearStartingCharCount(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](4, _c1, _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](1, 2, ctx_r9.uiSettingsService.showTooltips$)))("icon", ctx_r9.faEraser);
} }
function AppComponent_ng_container_1_label_12_Template(rf, ctx) { if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "label", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](1, "fa-icon", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](2, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](3, "input", 26, 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("change", function AppComponent_ng_container_1_label_12_Template_input_change_3_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r19); const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵreference"](4); const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2); return ctx_r18.onInputChange(_r17); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](4, _c1, _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](2, 2, ctx_r11.uiSettingsService.showTooltips$)))("icon", ctx_r11.faFolderPlus);
} }
const _c2 = function (a0) { return { "tooltip bottom-left": a0 }; };
function AppComponent_ng_container_1_fa_icon_18_Template(rf, ctx) { if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "fa-icon", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function AppComponent_ng_container_1_fa_icon_18_Template_fa_icon_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r21); const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2); return ctx_r20.toggleFullscreen(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](4, _c2, _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](1, 2, ctx_r12.uiSettingsService.showTooltips$)))("icon", ctx_r12.faExpand);
} }
const _c3 = function (a0) { return { "tooltip bottom-right": a0 }; };
function AppComponent_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](1, AppComponent_ng_container_1_div_1_Template, 4, 4, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](2, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](3, AppComponent_ng_container_1_fa_icon_3_Template, 2, 6, "fa-icon", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](4, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](5, AppComponent_ng_container_1_fa_icon_5_Template, 2, 6, "fa-icon", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](6, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](7, "label", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](8, "fa-icon", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](9, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](10, "input", 14, 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("change", function AppComponent_ng_container_1_Template_input_change_10_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r23); const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵreference"](11); const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](); return ctx_r22.onInputChange(_r10); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](12, AppComponent_ng_container_1_label_12_Template, 5, 6, "label", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](13, "fa-icon", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function AppComponent_ng_container_1_Template_fa_icon_click_13_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r23); const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](); return ctx_r24.bookmarManagerService.saveScrollPosition(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](14, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](15, "fa-icon", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function AppComponent_ng_container_1_Template_fa_icon_click_15_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r23); const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](); return ctx_r25.setShowSettingsDialog(true); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](16, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](17, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](18, AppComponent_ng_container_1_fa_icon_18_Template, 2, 6, "fa-icon", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](19, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementContainerEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx_r0.autoScrollerService.activated);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](25, _c0, !ctx_r0.showUi));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", !_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](4, 13, ctx_r0.readingStatsManagerService.currentlyTracking$));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](6, 15, ctx_r0.readingStatsManagerService.currentlyTracking$));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](27, _c1, _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](9, 17, ctx_r0.uiSettingsService.showTooltips$)))("icon", ctx_r0.faFileMedical);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", !ctx_r0.isMobileDevice);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](29, _c1, _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](14, 19, ctx_r0.uiSettingsService.showTooltips$)))("icon", ctx_r0.faBookmark);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](31, _c3, _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](16, 21, ctx_r0.uiSettingsService.showTooltips$)))("icon", ctx_r0.faCog);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](33, _c0, !ctx_r0.showUi));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", !_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](19, 23, ctx_r0.minimalUi$) && ctx_r0.supportsFullscreen && !ctx_r0.autoScrollerService.activated);
} }
function AppComponent_div_3_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](1, " Loading...\n");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
} }
function AppComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](1, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](2, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](ctx_r2.ebookDisplayManagerService.loadingFiles$.value == null ? null : ctx_r2.ebookDisplayManagerService.loadingFiles$.value.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵstyleProp"]("width", ctx_r2.ebookDisplayManagerService.loadingFiles$.value == null ? null : ctx_r2.ebookDisplayManagerService.loadingFiles$.value.progress);
} }
function AppComponent_ng_template_7_label_0_Template(rf, ctx) { if (rf & 1) {
    const _r30 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "label", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function AppComponent_ng_template_7_label_0_Template_label_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r30); _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](); const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵreference"](3); return _r27.click(); })("contextmenu", function AppComponent_ng_template_7_label_0_Template_label_contextmenu_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r30); _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](); const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵreference"](5); $event.preventDefault(); return _r28.click(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate1"](" ", ctx_r26.dropZoneLabel, " ");
} }
function AppComponent_ng_template_7_Template(rf, ctx) { if (rf & 1) {
    const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](0, AppComponent_ng_template_7_label_0_Template, 2, 1, "label", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](1, "async");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](2, "input", 14, 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("change", function AppComponent_ng_template_7_Template_input_change_2_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r33); const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵreference"](3); const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](); return ctx_r32.onInputChange(_r27); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "input", 26, 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("change", function AppComponent_ng_template_7_Template_input_change_4_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r33); const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵreference"](5); const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](); return ctx_r34.onInputChange(_r28); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", !_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](1, 1, ctx_r4.visible$));
} }
function AppComponent_div_9_Template(rf, ctx) { if (rf & 1) {
    const _r36 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function AppComponent_div_9_Template_div_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r36); const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](); return ctx_r35.setShowSettingsDialog(false); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](1, "app-settings-dialog", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("closeClick", function AppComponent_div_9_Template_app_settings_dialog_closeClick_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r36); const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](); return ctx_r37.setShowSettingsDialog(false); })("click", function AppComponent_div_9_Template_app_settings_dialog_click_1_listener($event) { return $event.stopPropagation(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
} }
function AppComponent_fa_icon_10_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](0, "fa-icon", 40);
} if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("icon", ctx_r6.faSyncAlt);
} }
const _c4 = function (a0) { return { "invisible": a0 }; };
class AppComponent {
    constructor(autoScrollerService, bookmarManagerService, ebookDisplayManagerService, readingStatsManagerService, uiSettingsService, scrollInformationService, themeManagerService, databaseService, router, route, zone, updates) {
        this.autoScrollerService = autoScrollerService;
        this.bookmarManagerService = bookmarManagerService;
        this.ebookDisplayManagerService = ebookDisplayManagerService;
        this.readingStatsManagerService = readingStatsManagerService;
        this.uiSettingsService = uiSettingsService;
        this.scrollInformationService = scrollInformationService;
        this.themeManagerService = themeManagerService;
        this.databaseService = databaseService;
        this.router = router;
        this.route = route;
        this.zone = zone;
        this.visible$ = this.router.events.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["filter"])((event) => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__["NavigationEnd"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["switchMap"])(() => {
            if (this.route.firstChild) {
                return this.route.firstChild.paramMap.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["map"])((paramMap) => paramMap.has('identifier')));
            }
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_11__["of"])(false);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["shareReplay"])(1));
        // Mostly for apps that uses this webapp as their component (e.g. jidoujisho)
        this.minimalUi$ = this.route.queryParamMap.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["map"])((paramMap) => paramMap.has('min')));
        this.loadingDb = true;
        this.isMobileDevice = this.isMobile();
        this.supportsFullscreen = this.fullscreenEnabled();
        this.showUi = true;
        this.dropZoneLabel = this.isMobileDevice ?
            'Select supported files (.htmlz or .epub) to continue' :
            'Drop or select files (.htmlz or .epub) or a folder that contains those files to continue';
        this.dropzoneHighlight = false;
        this.showSettingsDialog = false;
        this.faFileMedical = _fortawesome_free_solid_svg_icons_faFileMedical__WEBPACK_IMPORTED_MODULE_6__["faFileMedical"];
        this.faFolderPlus = _fortawesome_free_solid_svg_icons_faFolderPlus__WEBPACK_IMPORTED_MODULE_7__["faFolderPlus"];
        this.faCog = _fortawesome_free_solid_svg_icons_faCog__WEBPACK_IMPORTED_MODULE_3__["faCog"];
        this.faBookmark = _fortawesome_free_regular_svg_icons_faBookmark__WEBPACK_IMPORTED_MODULE_2__["faBookmark"];
        this.faSyncAlt = _fortawesome_free_solid_svg_icons_faSyncAlt__WEBPACK_IMPORTED_MODULE_9__["faSyncAlt"];
        this.faExpand = _fortawesome_free_solid_svg_icons_faExpand__WEBPACK_IMPORTED_MODULE_5__["faExpand"];
        this.faRuler = _fortawesome_free_solid_svg_icons_faRuler__WEBPACK_IMPORTED_MODULE_8__["faRuler"];
        this.faEraser = _fortawesome_free_solid_svg_icons_faEraser__WEBPACK_IMPORTED_MODULE_4__["faEraser"];
        this.isUpdateAvailable = false;
        this.filePattern = /\.(?:htmlz|epub)$/;
        updates.available.subscribe(() => {
            this.isUpdateAvailable = true;
        });
    }
    ngOnInit() {
        Object(rxjs__WEBPACK_IMPORTED_MODULE_11__["fromEvent"])(document.body, 'dragenter').subscribe((ev) => this.onDragEnter(ev));
        Object(rxjs__WEBPACK_IMPORTED_MODULE_11__["fromEvent"])(document.body, 'dragover').subscribe((ev) => this.onDragOver(ev));
        Object(rxjs__WEBPACK_IMPORTED_MODULE_11__["fromEvent"])(document.body, 'dragend').subscribe((ev) => this.onDragEnd(ev));
        Object(rxjs__WEBPACK_IMPORTED_MODULE_11__["fromEvent"])(document.body, 'drop').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["withLatestFrom"])(this.ebookDisplayManagerService.loadingFiles$)).subscribe(([ev, loadingFiles$]) => {
            ev.preventDefault();
            if (!loadingFiles$) {
                this.onDrop(ev);
            }
        });
        Object(rxjs__WEBPACK_IMPORTED_MODULE_11__["fromEvent"])(window, 'keydown').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["withLatestFrom"])(this.ebookDisplayManagerService.loadingFile$, this.visible$)).subscribe(([ev, loadingFile, visible]) => {
            if (!loadingFile && visible) {
                switch (ev.code) {
                    case 'Escape':
                        this.setShowSettingsDialog(false);
                        break;
                    case 'Space':
                        this.autoScrollerService.toggle();
                        ev.preventDefault();
                        break;
                    case 'KeyA':
                        this.autoScrollerService.increaseSpeed();
                        break;
                    case 'KeyD':
                        this.autoScrollerService.decreaseSpeed();
                        break;
                    case 'KeyB':
                        this.bookmarManagerService.saveScrollPosition();
                        break;
                    case 'PageDown':
                        window.scrollBy({
                            left: window.innerWidth * -.9,
                            behavior: 'smooth',
                        });
                        break;
                    case 'PageUp':
                        window.scrollBy({
                            left: window.innerWidth * .9,
                            behavior: 'smooth',
                        });
                        break;
                }
            }
        });
        this.databaseService.db.then((db) => {
            this.visible$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_12__["take"])(1)).subscribe((visible) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                if (!visible) {
                    const lastItem = yield db.get('lastItem', 0);
                    if (lastItem) {
                        this.ebookDisplayManagerService.loadingFile$.next(true); // otherwise may get NG0100 (if modified while init ReaderComponent)
                        yield this.router.navigate(['b', lastItem.dataId], {
                            queryParamsHandling: 'merge',
                        });
                    }
                }
                this.loadingDb = false;
            }));
        });
    }
    isMobile() {
        var _a;
        if ('maxTouchPoints' in window.navigator) {
            return 0 < window.navigator.maxTouchPoints;
        }
        if ('msMaxTouchPoints' in window.navigator) {
            return 0 < window.navigator.msMaxTouchPoints;
        }
        const mQ = (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, '(pointer:coarse)');
        if ((mQ === null || mQ === void 0 ? void 0 : mQ.media) === '(pointer: coarse)') {
            return mQ.matches;
        }
        if ('orientation' in window) {
            return true;
        }
        const UA = window.navigator.userAgent;
        const userAgentRegex = /\b(BlackBerry|webOS|iPhone|IEMobile|Android|Windows Phone|iPad|iPod)\b/i;
        return userAgentRegex.test(UA);
    }
    onInputChange(el) {
        var _a;
        if ((_a = el.files) === null || _a === void 0 ? void 0 : _a.length) {
            const validFiles = Array.from(el.files).filter((file) => this.filePattern.test(file.name));
            if (validFiles.length) {
                this.onFileChange(validFiles);
            }
            else {
                alert('Only .htmlz and .epub Files are supported');
            }
        }
    }
    setShowSettingsDialog(b) {
        this.showSettingsDialog = b;
        this.ebookDisplayManagerService.allowScroll = !b;
        if (b) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.removeProperty('overflow');
        }
    }
    fullscreenEnabled() {
        var _a;
        return (_a = document.fullscreenEnabled) !== null && _a !== void 0 ? _a : false;
    }
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
        else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    toggleUi() {
        this.showUi = !this.showUi;
    }
    onDrop(ev) {
        var _a;
        this.dropzoneHighlight = false;
        if (!((_a = ev === null || ev === void 0 ? void 0 : ev.dataTransfer) === null || _a === void 0 ? void 0 : _a.items)) {
            return;
        }
        const items = [];
        for (const item of ev.dataTransfer.items) {
            if ('file' !== item.kind) {
                continue;
            }
            items.push(item.webkitGetAsEntry());
        }
        if (items.length) {
            this.handleDropResult(items);
        }
    }
    handleDropResult(items) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const addFilesFromDirectory = (entry, fileMap) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                if (entry.isDirectory) {
                    const dirReader = entry.createReader();
                    const entries = yield new Promise((resolve) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                        const allEntries = [];
                        let dirEntries = yield new Promise((innerResolve) => dirReader.readEntries(innerResolve)).catch(() => []);
                        while (dirEntries.length) {
                            allEntries.push(...dirEntries);
                            dirEntries = yield new Promise((innerResolve) => dirReader.readEntries(innerResolve)).catch(() => []);
                        }
                        resolve(allEntries);
                    })).catch(() => []);
                    for (let index = 0, length = entries.length; index < length; index++) {
                        yield addFilesFromDirectory(entries[index], fileMap).catch(() => { });
                    }
                }
                else {
                    const file = yield new Promise((resolve) => entry.file(resolve)).catch(() => { });
                    if (file && this.filePattern.test(file.name)) {
                        fileMap.set(file.name, file);
                    }
                }
            });
            const files = new Map();
            for (let index = 0, length = items.length; index < length; index++) {
                const entry = items[index];
                if (entry.isDirectory) {
                    yield addFilesFromDirectory(entry, files);
                }
                else if (this.filePattern.test(entry.name)) {
                    const file = yield new Promise((resolve) => entry.file(resolve)).catch(() => { });
                    if (file) {
                        files.set(file.name, file);
                    }
                }
            }
            if (!files.size) {
                return alert('Only .htmlz and .epub Files are supported');
            }
            this.onFileChange(Array.from(files.values()));
        });
    }
    onDragEnter(ev) {
        ev.preventDefault();
        this.dropzoneHighlight = true;
    }
    onDragOver(ev) {
        ev.preventDefault();
        this.dropzoneHighlight = true;
    }
    onDragEnd(ev) {
        ev.preventDefault();
        this.dropzoneHighlight = false;
    }
    onFileChange(files) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const multiFiles = 1 < files.length;
            let dataId = 0;
            let importFailures = 0;
            this.autoScrollerService.stop();
            if (!multiFiles) {
                this.ebookDisplayManagerService.loadingFile$.next(true);
            }
            const db = yield this.databaseService.db.catch(() => {
                if (!multiFiles) {
                    this.ebookDisplayManagerService.loadingFile$.next(false);
                }
                return undefined;
            });
            if (!db) {
                return alert('Failure accessing Database');
            }
            for (let index = 0, length = files.length; index < length; index++) {
                const file = files[index];
                if (multiFiles) {
                    this.ebookDisplayManagerService.loadingFiles$.next({
                        title: file.name,
                        progress: `${Math.round(index / length * 100)}%`
                    });
                }
                const lastDataId = yield this.storeFileInDB(db, file);
                if (lastDataId) {
                    dataId = lastDataId;
                }
                else {
                    importFailures++;
                }
            }
            if (importFailures) {
                alert(`${importFailures} Import(s) failed`);
            }
            if (multiFiles) {
                this.ebookDisplayManagerService.loadingFiles$.next(undefined);
            }
            if (!dataId) {
                if (!multiFiles) {
                    this.ebookDisplayManagerService.loadingFile$.next(false);
                }
                return;
            }
            void db.put('lastItem', {
                dataId,
            }, 0).catch(() => { });
            yield this.zone.run(() => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                this.ebookDisplayManagerService.loadingFile$.next(true);
                const changedIdentifier = yield this.router.navigate(['b', dataId], {
                    queryParamsHandling: 'merge',
                });
                if (!changedIdentifier) {
                    this.ebookDisplayManagerService.revalidateFile.next();
                }
            })).catch(() => this.ebookDisplayManagerService.loadingFile$.next(false));
        });
    }
    storeFileInDB(db, file) {
        return this.zone.runOutsideAngular(() => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            try {
                const storeData = file.name.endsWith('.epub') ? yield processEpub(file) : yield processHtmlz(file);
                let dataId;
                {
                    const tx = db.transaction('data', 'readwrite');
                    const store = tx.store;
                    const oldId = yield store.index('title').getKey(storeData.title);
                    if (oldId) {
                        dataId = yield store.put(Object.assign(Object.assign({}, storeData), { id: oldId }));
                    }
                    else {
                        dataId = yield store.add(storeData);
                    }
                    yield tx.done;
                    return dataId;
                }
            }
            catch (ex) {
                console.error(`${file.name}: ${ex.message}`);
                return undefined;
            }
        }));
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_auto_scroller_service__WEBPACK_IMPORTED_MODULE_18__["AutoScrollerService"]), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_bookmark_manager_service__WEBPACK_IMPORTED_MODULE_19__["BookmarkManagerService"]), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_ebook_display_manager_service__WEBPACK_IMPORTED_MODULE_20__["EbookDisplayManagerService"]), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_reading_stats_manager_service__WEBPACK_IMPORTED_MODULE_21__["ReadingStatsManagerService"]), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_ui_settings_service__WEBPACK_IMPORTED_MODULE_22__["UiSettingsService"]), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_scroll_information_service__WEBPACK_IMPORTED_MODULE_23__["ScrollInformationService"]), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_theme_manager_service__WEBPACK_IMPORTED_MODULE_24__["ThemeManagerService"]), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_database_service__WEBPACK_IMPORTED_MODULE_25__["DatabaseService"]), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"]), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["NgZone"]), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_angular_service_worker__WEBPACK_IMPORTED_MODULE_26__["SwUpdate"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 16, vars: 20, consts: [[4, "ngIf"], ["class", "overlay-container loading-container", 4, "ngIf", "ngIfElse"], ["class", "overlay-container loading-container drop-zone-container darker", 4, "ngIf"], ["notLoadingRef", ""], ["class", "dialog-overlay", 3, "click", 4, "ngIf"], ["class", "information-overlay bottom-overlay update-ready-icon", 3, "icon", 4, "ngIf"], ["id", "scroll-info", 1, "information-overlay", "bottom-overlay", "scroll-information", 3, "ngClass", "click"], ["id", "reading-stats-info", 1, "information-overlay", "bottom-overlay", "reading-stats-information", 3, "ngClass", "click"], ["class", "top-overlay auto-mode-container", 3, "ngClass", 4, "ngIf"], [1, "top-overlay", "action-icon-container", 3, "ngClass"], ["class", "action-icon margin-icon", "data-tooltip", "Start Tracking", 3, "ngClass", "icon", "click", 4, "ngIf"], ["class", "action-icon margin-icon", "data-tooltip", "Clear Tracking", 3, "ngClass", "icon", "click", 4, "ngIf"], [1, "no-margin"], ["data-tooltip", "Import File", 1, "action-icon", 3, "ngClass", "icon"], ["type", "file", "accept", ".htmlz,.epub", "multiple", "", "hidden", "", 3, "change"], ["inputRef", ""], ["class", "no-margin", 4, "ngIf"], ["data-tooltip", "Bookmark", 1, "action-icon", "margin-icon", 3, "ngClass", "icon", "click"], ["data-tooltip", "Settings", 1, "action-icon", "margin-icon", 3, "ngClass", "icon", "click"], [1, "top-overlay", "action-icon-container--left", 3, "ngClass"], ["class", "action-icon margin-icon", "data-tooltip", "Toggle Fullscreen", 3, "ngClass", "icon", "click", 4, "ngIf"], [1, "top-overlay", "auto-mode-container", 3, "ngClass"], [1, "uppercase"], ["data-tooltip", "Start Tracking", 1, "action-icon", "margin-icon", 3, "ngClass", "icon", "click"], ["data-tooltip", "Clear Tracking", 1, "action-icon", "margin-icon", 3, "ngClass", "icon", "click"], ["data-tooltip", "Import Folder", 1, "action-icon", "margin-icon", 3, "ngClass", "icon"], ["type", "file", "webkitdirectory", "", "directory", "", "multiple", "", "hidden", "", 3, "change"], ["inputDirRef", ""], ["data-tooltip", "Toggle Fullscreen", 1, "action-icon", "margin-icon", 3, "ngClass", "icon", "click"], [1, "overlay-container", "loading-container"], [1, "overlay-container", "loading-container", "drop-zone-container", "darker"], [1, "progress-container"], [1, "truncate"], [1, "progress"], ["class", "overlay-container drop-zone-container label-button", 3, "click", "contextmenu", 4, "ngIf"], ["zoneInputRef", ""], ["zoneInputDirRef", ""], [1, "overlay-container", "drop-zone-container", "label-button", 3, "click", "contextmenu"], [1, "dialog-overlay", 3, "click"], [1, "settings-dialog", 3, "closeClick", "click"], [1, "information-overlay", "bottom-overlay", "update-ready-icon", 3, "icon"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](0, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](1, AppComponent_ng_container_1_Template, 20, 35, "ng-container", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](2, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](3, AppComponent_div_3_Template, 2, 0, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](4, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](5, AppComponent_div_5_Template, 6, 3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](6, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](7, AppComponent_ng_template_7_Template, 6, 3, "ng-template", null, 3, _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](9, AppComponent_div_9_Template, 2, 0, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](10, AppComponent_fa_icon_10_Template, 1, 1, "fa-icon", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](11, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function AppComponent_Template_div_click_11_listener() { return ctx.toggleUi(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](12, " Loading position...\n");
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](13, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function AppComponent_Template_div_click_13_listener() { return ctx.toggleUi(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](14, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](15, " Loading stats...\n");
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵreference"](8);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](2, 8, ctx.visible$));
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx.loadingDb || _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](4, 10, ctx.ebookDisplayManagerService.loadingFile$))("ngIfElse", _r3);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](6, 12, ctx.ebookDisplayManagerService.loadingFiles$));
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx.showSettingsDialog);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx.isUpdateAvailable);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](16, _c4, !ctx.showUi));
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction1"](18, _c0, !ctx.showUi || !_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](14, 14, ctx.readingStatsManagerService.currentlyTracking$)));
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"], _angular_common__WEBPACK_IMPORTED_MODULE_27__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_27__["NgClass"], _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_28__["FaIconComponent"], _settings_dialog_settings_dialog_component__WEBPACK_IMPORTED_MODULE_29__["SettingsDialogComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_27__["AsyncPipe"]], styles: [".top-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  color: var(--scroll-info-font-color);\n  z-index: 100;\n  -webkit-user-select: none;\n          user-select: none;\n  writing-mode: horizontal-tb;\n  top: 0;\n}\n@media screen and (min-height: 625px) {\n  .top-overlay[_ngcontent-%COMP%] {\n    top: 8px;\n  }\n}\n@media screen and (min-height: 725px) {\n  .top-overlay[_ngcontent-%COMP%] {\n    top: 16px;\n  }\n}\n.auto-mode-container[_ngcontent-%COMP%] {\n  left: 8px;\n  font-size: 10px;\n  padding: 2px;\n  font-weight: 500;\n  opacity: 0.6;\n}\n@media screen and (min-height: 900px) {\n  .auto-mode-container[_ngcontent-%COMP%] {\n    font-size: 16px;\n  }\n}\n.uppercase[_ngcontent-%COMP%] {\n  text-transform: uppercase;\n}\n.action-icon-container[_ngcontent-%COMP%] {\n  display: flex;\n  font-size: 16px;\n  right: 8px;\n}\n@media screen and (min-height: 900px) {\n  .action-icon-container[_ngcontent-%COMP%] {\n    font-size: 24px;\n  }\n}\n.action-icon-container--left[_ngcontent-%COMP%] {\n  display: flex;\n  font-size: 16px;\n  left: 8px;\n}\n@media screen and (min-height: 900px) {\n  .action-icon-container--left[_ngcontent-%COMP%] {\n    font-size: 24px;\n  }\n}\n.action-icon[_ngcontent-%COMP%] {\n  display: block;\n  cursor: pointer;\n  padding: 2px;\n  opacity: 0.6;\n}\n.action-icon[_ngcontent-%COMP%]:hover {\n  opacity: 1;\n}\n@media screen and (min-height: 625px) {\n  .action-icon[_ngcontent-%COMP%] {\n    padding: 4px;\n  }\n}\n@media screen and (min-height: 725px) {\n  .action-icon[_ngcontent-%COMP%] {\n    padding: 8px;\n  }\n}\n.margin-icon[_ngcontent-%COMP%] {\n  margin-left: 16px;\n}\n@media screen and (min-height: 900px) {\n  .margin-icon[_ngcontent-%COMP%] {\n    margin-left: 8px;\n  }\n}\n.dialog-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  z-index: 1000;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(38, 40, 41, 0.6);\n}\n.settings-dialog[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  box-shadow: 0 3px 8px rgba(33, 37, 41, 0.2);\n}\n.overlay-container[_ngcontent-%COMP%] {\n  position: fixed;\n  writing-mode: horizontal-tb;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  color: #ffffff;\n  background-color: rgba(38, 40, 41, 0.8);\n}\n.loading-container[_ngcontent-%COMP%] {\n  z-index: 500;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.loading-container.darker[_ngcontent-%COMP%] {\n  background-color: rgba(0, 0, 0, 0.9);\n}\n.progress-container[_ngcontent-%COMP%] {\n  width: 100vw;\n}\n.progress-container[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n  margin: 0rem 3rem;\n}\n@media screen and (min-width: 1200px) {\n  .progress-container[_ngcontent-%COMP%]    > div[_ngcontent-%COMP%] {\n    margin: 0;\n  }\n}\n.progress-container[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:first-child {\n  margin-bottom: 2rem;\n}\n@media screen and (min-width: 1200px) {\n  .progress-container[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:first-child {\n    margin-bottom: 1rem;\n  }\n}\n.progress-container[_ngcontent-%COMP%]   .truncate[_ngcontent-%COMP%] {\n  width: calc(100vw - 6rem);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n@media screen and (min-width: 1200px) {\n  .progress-container[_ngcontent-%COMP%]   .truncate[_ngcontent-%COMP%] {\n    width: 50vw;\n  }\n}\n.progress-container[_ngcontent-%COMP%]   .progress[_ngcontent-%COMP%] {\n  box-sizing: content-box;\n  height: 20px;\n  position: relative;\n  background: #555;\n  border-radius: 25px;\n  padding: 10px;\n  box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);\n}\n.progress-container[_ngcontent-%COMP%]   .progress[_ngcontent-%COMP%]    > span[_ngcontent-%COMP%] {\n  display: block;\n  height: 100%;\n  border-top-right-radius: 8px;\n  border-bottom-right-radius: 8px;\n  border-top-left-radius: 20px;\n  border-bottom-left-radius: 20px;\n  background-color: #2bc253;\n  box-shadow: inset 0 2px 9px rgba(255, 255, 255, 0.3), inset 0 -2px 6px rgba(0, 0, 0, 0.4);\n  position: relative;\n  overflow: hidden;\n}\n@media screen and (min-width: 1200px) {\n  .progress-container[_ngcontent-%COMP%] {\n    width: 50vw;\n  }\n}\n.drop-zone-container[_ngcontent-%COMP%] {\n  z-index: 1001;\n}\n.label-button[_ngcontent-%COMP%] {\n  cursor: pointer;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n}\n.no-margin[_ngcontent-%COMP%] {\n  margin: 0;\n}\n.book-library-screen[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  writing-mode: horizontal-tb;\n}\n.update-ready-icon[_ngcontent-%COMP%] {\n  left: 8px;\n}\n.tooltip[_ngcontent-%COMP%] {\n  position: relative;\n}\n.tooltip[_ngcontent-%COMP%]:before {\n  content: attr(data-tooltip);\n  position: absolute;\n  max-width: 130px;\n  padding: 10px;\n  border-radius: 10px;\n  background: #000;\n  color: #fff;\n  text-align: center;\n  display: none;\n}\n.tooltip[_ngcontent-%COMP%]:hover:before {\n  display: block;\n}\n.tooltip.bottom-left[_ngcontent-%COMP%]:before {\n  top: 100%;\n  left: 0%;\n}\n.tooltip.bottom-center[_ngcontent-%COMP%]:before {\n  top: 100%;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.tooltip.bottom-right[_ngcontent-%COMP%]:before {\n  top: 100%;\n  right: 0%;\n}\n.invisible[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.hide[_ngcontent-%COMP%] {\n  display: none;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGVBQUE7RUFDQSxvQ0FBQTtFQUNBLFlBQUE7RUFDQSx5QkFBQTtVQUFBLGlCQUFBO0VBQ0EsMkJBQUE7RUFDQSxNQUFBO0FBQ0Y7QUFDRTtFQVJGO0lBU0ksUUFBQTtFQUVGO0FBQ0Y7QUFBRTtFQVpGO0lBYUksU0FBQTtFQUdGO0FBQ0Y7QUFBQTtFQUNFLFNBQUE7RUFDQSxlQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtBQUdGO0FBREU7RUFQRjtJQVFJLGVBQUE7RUFJRjtBQUNGO0FBREE7RUFDRSx5QkFBQTtBQUlGO0FBREE7RUFDRSxhQUFBO0VBQ0EsZUFBQTtFQUNBLFVBQUE7QUFJRjtBQUZFO0VBTEY7SUFNSSxlQUFBO0VBS0Y7QUFDRjtBQUZBO0VBQ0UsYUFBQTtFQUNBLGVBQUE7RUFDQSxTQUFBO0FBS0Y7QUFIRTtFQUxGO0lBTUksZUFBQTtFQU1GO0FBQ0Y7QUFIQTtFQUNFLGNBQUE7RUFDQSxlQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7QUFNRjtBQUpFO0VBQ0UsVUFBQTtBQU1KO0FBSEU7RUFWRjtJQVdJLFlBQUE7RUFNRjtBQUNGO0FBSkU7RUFkRjtJQWVJLFlBQUE7RUFPRjtBQUNGO0FBSEE7RUFDRSxpQkFBQTtBQU1GO0FBSkU7RUFIRjtJQUlJLGdCQUFBO0VBT0Y7QUFDRjtBQUpBO0VBQ0UsZUFBQTtFQUNBLGFBQUE7RUFDQSxNQUFBO0VBQ0EsU0FBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsdUNBQUE7QUFPRjtBQUpBO0VBQ0Usa0JBQUE7RUFDQSxTQUFBO0VBQ0EsUUFBQTtFQUNBLGdDQUFBO0VBQ0EsMkNBQUE7QUFPRjtBQUpBO0VBQ0UsZUFBQTtFQUNBLDJCQUFBO0VBQ0EsTUFBQTtFQUNBLFNBQUE7RUFDQSxPQUFBO0VBQ0EsUUFBQTtFQUNBLGNBQUE7RUFDQSx1Q0FBQTtBQU9GO0FBSkE7RUFDRSxZQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7QUFPRjtBQUxFO0VBQ0Usb0NBQUE7QUFPSjtBQUhBO0VBQ0UsWUFBQTtBQU1GO0FBSkU7RUFDRSxpQkFBQTtBQU1KO0FBSkk7RUFIRjtJQUlJLFNBQUE7RUFPSjtBQUNGO0FBSkU7RUFDRSxtQkFBQTtBQU1KO0FBSkk7RUFIRjtJQUlJLG1CQUFBO0VBT0o7QUFDRjtBQUpFO0VBQ0UseUJBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0EsdUJBQUE7QUFNSjtBQUpJO0VBTkY7SUFPSSxXQUFBO0VBT0o7QUFDRjtBQUpFO0VBQ0UsdUJBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLHFEQUFBO0FBTUo7QUFKSTtFQUNFLGNBQUE7RUFDQSxZQUFBO0VBQ0EsNEJBQUE7RUFDQSwrQkFBQTtFQUNBLDRCQUFBO0VBQ0EsK0JBQUE7RUFDQSx5QkFBQTtFQUNBLHlGQUFBO0VBRUEsa0JBQUE7RUFDQSxnQkFBQTtBQUtOO0FBREU7RUF0REY7SUF1REksV0FBQTtFQUlGO0FBQ0Y7QUFEQTtFQUNFLGFBQUE7QUFJRjtBQURBO0VBQ0UsZUFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxrQkFBQTtBQUlGO0FBREE7RUFDRSxTQUFBO0FBSUY7QUFEQTtFQUNFLGNBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLDJCQUFBO0FBSUY7QUFEQTtFQUNFLFNBQUE7QUFJRjtBQURBO0VBQ0Usa0JBQUE7QUFJRjtBQUZFO0VBQ0UsMkJBQUE7RUFDQSxrQkFBQTtFQUVBLGdCQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7RUFFQSxhQUFBO0FBRUo7QUFDRTtFQUNFLGNBQUE7QUFDSjtBQUVFO0VBQ0UsU0FBQTtFQUNBLFFBQUE7QUFBSjtBQUdFO0VBQ0UsU0FBQTtFQUNBLFNBQUE7RUFDQSwyQkFBQTtBQURKO0FBSUU7RUFDRSxTQUFBO0VBQ0EsU0FBQTtBQUZKO0FBTUE7RUFDRSxVQUFBO0FBSEY7QUFNQTtFQUNFLGFBQUE7QUFIRiIsImZpbGUiOiJhcHAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIudG9wLW92ZXJsYXkge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGNvbG9yOiB2YXIoLS1zY3JvbGwtaW5mby1mb250LWNvbG9yKTtcbiAgei1pbmRleDogMTAwO1xuICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgd3JpdGluZy1tb2RlOiBob3Jpem9udGFsLXRiO1xuICB0b3A6IDA7XG5cbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi1oZWlnaHQ6IDYyNXB4KSB7XG4gICAgdG9wOiA4cHg7XG4gIH1cblxuICBAbWVkaWEgc2NyZWVuIGFuZCAobWluLWhlaWdodDogNzI1cHgpIHtcbiAgICB0b3A6IDE2cHg7XG4gIH1cbn1cblxuLmF1dG8tbW9kZS1jb250YWluZXIge1xuICBsZWZ0OiA4cHg7XG4gIGZvbnQtc2l6ZTogMTBweDtcbiAgcGFkZGluZzogMnB4O1xuICBmb250LXdlaWdodDogNTAwO1xuICBvcGFjaXR5OiAuNjtcblxuICBAbWVkaWEgc2NyZWVuIGFuZCAobWluLWhlaWdodDogOTAwcHgpIHtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gIH1cbn1cblxuLnVwcGVyY2FzZSB7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG59XG5cbi5hY3Rpb24taWNvbi1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmb250LXNpemU6IDE2cHg7XG4gIHJpZ2h0OiA4cHg7XG5cbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi1oZWlnaHQ6IDkwMHB4KSB7XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICB9XG59XG5cbi5hY3Rpb24taWNvbi1jb250YWluZXItLWxlZnQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmb250LXNpemU6IDE2cHg7XG4gIGxlZnQ6IDhweDtcblxuICBAbWVkaWEgc2NyZWVuIGFuZCAobWluLWhlaWdodDogOTAwcHgpIHtcbiAgICBmb250LXNpemU6IDI0cHg7XG4gIH1cbn1cblxuLmFjdGlvbi1pY29uIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgcGFkZGluZzogMnB4O1xuICBvcGFjaXR5OiAwLjY7XG5cbiAgJjpob3ZlciB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuXG4gIEBtZWRpYSBzY3JlZW4gYW5kIChtaW4taGVpZ2h0OiA2MjVweCkge1xuICAgIHBhZGRpbmc6IDRweDtcbiAgfVxuXG4gIEBtZWRpYSBzY3JlZW4gYW5kIChtaW4taGVpZ2h0OiA3MjVweCkge1xuICAgIHBhZGRpbmc6IDhweDtcbiAgfVxuXG59XG5cbi5tYXJnaW4taWNvbiB7XG4gIG1hcmdpbi1sZWZ0OiAxNnB4O1xuXG4gIEBtZWRpYSBzY3JlZW4gYW5kIChtaW4taGVpZ2h0OiA5MDBweCkge1xuICAgIG1hcmdpbi1sZWZ0OiA4cHg7XG4gIH1cbn1cblxuLmRpYWxvZy1vdmVybGF5IHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB6LWluZGV4OiAxMDAwO1xuICB0b3A6IDA7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMzgsIDQwLCA0MSwgLjYpO1xufVxuXG4uc2V0dGluZ3MtZGlhbG9nIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiA1MCU7XG4gIHRvcDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgYm94LXNoYWRvdzogMCAzcHggOHB4IHJnYmEoMzMsIDM3LCA0MSwgLjIpO1xufVxuXG4ub3ZlcmxheS1jb250YWluZXIge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHdyaXRpbmctbW9kZTogaG9yaXpvbnRhbC10YjtcbiAgdG9wOiAwO1xuICBib3R0b206IDA7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBjb2xvcjogI2ZmZmZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgzOCwgNDAsIDQxLCAuOCk7XG59XG5cbi5sb2FkaW5nLWNvbnRhaW5lciB7XG4gIHotaW5kZXg6IDUwMDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgJi5kYXJrZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC45KTtcbiAgfVxufVxuXG4ucHJvZ3Jlc3MtY29udGFpbmVyIHtcbiAgd2lkdGg6IDEwMHZ3O1xuXG4gID4gZGl2IHtcbiAgICBtYXJnaW46IDByZW0gM3JlbTtcblxuICAgIEBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDEyMDBweCkge1xuICAgICAgbWFyZ2luOiAwO1xuICAgIH1cbiAgfVxuXG4gIDpmaXJzdC1jaGlsZCB7XG4gICAgbWFyZ2luLWJvdHRvbTogMnJlbTtcblxuICAgIEBtZWRpYSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDEyMDBweCkge1xuICAgICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgICB9XG4gIH1cblxuICAudHJ1bmNhdGUge1xuICAgIHdpZHRoOiBjYWxjKDEwMHZ3IC0gNnJlbSk7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuXG4gICAgQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogMTIwMHB4KSB7XG4gICAgICB3aWR0aDogNTB2dztcbiAgICB9XG4gIH1cblxuICAucHJvZ3Jlc3Mge1xuICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xuICAgIGhlaWdodDogMjBweDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYmFja2dyb3VuZDogIzU1NTtcbiAgICBib3JkZXItcmFkaXVzOiAyNXB4O1xuICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgYm94LXNoYWRvdzogaW5zZXQgMCAtMXB4IDFweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMyk7XG5cbiAgICA+IHNwYW4ge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogOHB4O1xuICAgICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDhweDtcbiAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDIwcHg7XG4gICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAyMHB4O1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzJiYzI1MztcbiAgICAgIGJveC1zaGFkb3c6IGluc2V0IDAgMnB4IDlweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMyksXG4gICAgICAgIGluc2V0IDAgLTJweCA2cHggcmdiYSgwLCAwLCAwLCAwLjQpO1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB9XG4gIH1cblxuICBAbWVkaWEgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAxMjAwcHgpIHtcbiAgICB3aWR0aDogNTB2dztcbiAgfVxufVxuXG4uZHJvcC16b25lLWNvbnRhaW5lciB7XG4gIHotaW5kZXg6IDEwMDE7XG59XG5cbi5sYWJlbC1idXR0b24ge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5uby1tYXJnaW4ge1xuICBtYXJnaW46IDA7XG59XG5cbi5ib29rLWxpYnJhcnktc2NyZWVuIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdyaXRpbmctbW9kZTogaG9yaXpvbnRhbC10Yjtcbn1cblxuLnVwZGF0ZS1yZWFkeS1pY29uIHtcbiAgbGVmdDogOHB4O1xufVxuXG4udG9vbHRpcCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAmOmJlZm9yZSB7XG4gICAgY29udGVudDogYXR0cihkYXRhLXRvb2x0aXApO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICAgIG1heC13aWR0aDogMTMwcHg7XG4gICAgcGFkZGluZyA6MTBweDtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIGJhY2tncm91bmQ6IzAwMDtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG5cbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG5cbiAgJjpob3ZlcjpiZWZvcmUge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICB9XG5cbiAgJi5ib3R0b20tbGVmdDpiZWZvcmUge1xuICAgIHRvcDogMTAwJTtcbiAgICBsZWZ0OiAwJTtcbiAgfVxuXG4gICYuYm90dG9tLWNlbnRlcjpiZWZvcmUge1xuICAgIHRvcDogMTAwJTtcbiAgICBsZWZ0OiA1MCU7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xuICB9XG5cbiAgJi5ib3R0b20tcmlnaHQ6YmVmb3JlIHtcbiAgICB0b3A6IDEwMCU7XG4gICAgcmlnaHQ6IDAlO1xuICB9XG59XG5cbi5pbnZpc2libGUge1xuICBvcGFjaXR5OiAwO1xufVxuXG4uaGlkZSB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG4iXX0= */"] });
const htmlzExtractor = new _utils_extractor__WEBPACK_IMPORTED_MODULE_15__["HtmlzExtractor"]();
function processHtmlz(file) {
    var _a, _b;
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
        const data = yield htmlzExtractor.extract(file);
        const element = Object(_utils_html_fixer__WEBPACK_IMPORTED_MODULE_16__["getFormattedElementHtmlz"])(data);
        const metadata = (_b = (_a = fast_xml_parser__WEBPACK_IMPORTED_MODULE_10__["parse"](data['metadata.opf'])) === null || _a === void 0 ? void 0 : _a.package) === null || _b === void 0 ? void 0 : _b.metadata;
        const displayData = {
            title: file.name,
            styleSheet: fixStyleString(data['style.css']),
        };
        if (metadata && metadata['dc:title']) {
            displayData.title = metadata['dc:title'];
        }
        const blobData = Object.entries(data)
            .filter((d) => d[1] instanceof Blob)
            .reduce((acc, [k, v]) => {
            acc[k] = v;
            return acc;
        }, {});
        const blobDataWithoutCoverImage = Object.assign({}, blobData);
        delete blobDataWithoutCoverImage['cover.jpg'];
        const storeData = Object.assign(Object.assign({}, displayData), { elementHtml: element.innerHTML, blobs: blobDataWithoutCoverImage, coverImage: blobData['cover.jpg'] });
        return storeData;
    });
}
const epubExtractor = new _utils_extractor__WEBPACK_IMPORTED_MODULE_15__["EpubExtractor"]();
function processEpub(file) {
    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
        const { contents, result: data, } = yield epubExtractor.extract(file);
        const element = Object(_utils_html_fixer__WEBPACK_IMPORTED_MODULE_16__["getFormattedElementEpub"])(data, contents);
        let styleSheet = '';
        const cssFiles = contents.package.manifest.item
            .filter((item) => item['@_media-type'] === 'text/css')
            .map((item) => item['@_href']);
        if (cssFiles.length) {
            const cssPathsUnique = new Set(cssFiles);
            let combinedDirtyStyleString = '';
            for (const mainCssFilename of cssPathsUnique) {
                combinedDirtyStyleString += data[mainCssFilename];
            }
            if (combinedDirtyStyleString) {
                styleSheet = fixStyleString(combinedDirtyStyleString);
            }
        }
        const displayData = {
            title: file.name,
            styleSheet,
        };
        const metadata = contents.package.metadata;
        if (metadata) {
            const dcTitle = metadata['dc:title'];
            if (typeof dcTitle === 'string') {
                displayData.title = dcTitle;
            }
            else if (dcTitle && dcTitle['#text']) {
                displayData.title = dcTitle['#text'];
            }
        }
        const blobData = Object.entries(data)
            .filter((d) => d[1] instanceof Blob)
            .reduce((acc, [k, v]) => {
            acc[k] = v;
            return acc;
        }, {});
        let coverImageFilename = 'cover.jpeg';
        const coverDataItem = contents.package.manifest.item
            .find((item) => item['@_id'] === 'cover' && item['@_media-type'].startsWith('image/'));
        if (coverDataItem) {
            coverImageFilename = coverDataItem['@_href'];
        }
        const storeData = Object.assign(Object.assign({}, displayData), { elementHtml: element.innerHTML, blobs: blobData, coverImage: blobData[coverImageFilename] });
        return storeData;
    });
}
function fixStyleString(styleString) {
    const cssAst = Object(_utils_css_parser__WEBPACK_IMPORTED_MODULE_13__["default"])(styleString);
    let newRules = [];
    if (cssAst.stylesheet.rules) {
        for (const rule of cssAst.stylesheet.rules) {
            if (rule.type === 'rule') {
                newRules.push(rule);
            }
        }
    }
    newRules = newRules
        .filter((rule) => rule.selectors
        ? !rule.selectors.includes('html') && !rule.selectors.includes('body')
        : true);
    if (cssAst.stylesheet.rules) {
        for (const rule of newRules) {
            if (rule.declarations) {
                const newDeclarations = {};
                let hasLineBreakDefined;
                for (const declaration of rule.declarations) {
                    if (declaration.type === 'declaration') {
                        {
                            const regexResult = /(?:(?:-epub-)|(?:-webkit-))(.+)/i.exec(declaration.property);
                            if (regexResult) {
                                newDeclarations[regexResult[1]] = declaration.value;
                            }
                        }
                        if (declaration.property === 'font-family') {
                            let newValue = declaration.value;
                            if (newValue.includes('sans-serif')) {
                                newValue = `var(--font-family-sans-serif,"Noto Sans JP",${newValue})`;
                            }
                            else if (newValue.includes('serif')) {
                                newValue = `var(--font-family-serif,"Noto Serif JP",${newValue})`;
                            }
                            newDeclarations[declaration.property] = newValue;
                        }
                        if (/(?:(?:-epub-)|(?:-webkit-))?word-break$/i.exec(declaration.property) && declaration.value === 'break-all') {
                            if (hasLineBreakDefined === undefined) {
                                hasLineBreakDefined = rule.declarations.some((d) => d.type === 'declaration' && d.property === 'line-break');
                            }
                            if (!hasLineBreakDefined && !newDeclarations['line-break']) {
                                // to allow breaks one long string of periods
                                newDeclarations['line-break'] = 'loose';
                            }
                        }
                    }
                }
                for (const [property, value] of Object.entries(newDeclarations)) {
                    rule.declarations.push({
                        type: 'declaration',
                        property,
                        value,
                    });
                }
            }
        }
    }
    return Object(_utils_css_stringify__WEBPACK_IMPORTED_MODULE_14__["default"])({
        stylesheet: {
            rules: newRules,
        },
        type: 'stylesheet',
    });
}


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_service_worker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/service-worker */ "Jho9");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fortawesome/angular-fontawesome */ "6NWb");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _reader_reader_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./reader/reader.component */ "HMgo");
/* harmony import */ var _settings_dialog_settings_dialog_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./settings-dialog/settings-dialog.component */ "PyU3");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../environments/environment */ "AytR");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ "fXoL");










class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, providers: [], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
            _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_2__["FontAwesomeModule"],
            _angular_service_worker__WEBPACK_IMPORTED_MODULE_0__["ServiceWorkerModule"].register('ngsw-worker.js', {
                enabled: _environments_environment__WEBPACK_IMPORTED_MODULE_7__["environment"].production,
                // Register the ServiceWorker as soon as the app is stable
                // or after 30 seconds (whichever comes first).
                registrationStrategy: 'registerWhenStable:30000'
            }),
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
        _reader_reader_component__WEBPACK_IMPORTED_MODULE_5__["ReaderComponent"],
        _settings_dialog_settings_dialog_component__WEBPACK_IMPORTED_MODULE_6__["SettingsDialogComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
        _fortawesome_angular_fontawesome__WEBPACK_IMPORTED_MODULE_2__["FontAwesomeModule"], _angular_service_worker__WEBPACK_IMPORTED_MODULE_0__["ServiceWorkerModule"]] }); })();


/***/ }),

/***/ "ZJAV":
/*!****************************************!*\
  !*** ./src/app/ui-settings-service.ts ***!
  \****************************************/
/*! exports provided: UiSettingsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UiSettingsService", function() { return UiSettingsService; });
/* harmony import */ var _utils_local_storage_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/local-storage-utils */ "lgdk");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");


class UiSettingsService {
    constructor() {
        this.showTooltips$ = Object(_utils_local_storage_utils__WEBPACK_IMPORTED_MODULE_0__["createBooleanLocalStorageBehaviorSubject"])('showTooltips', true);
    }
}
UiSettingsService.ɵfac = function UiSettingsService_Factory(t) { return new (t || UiSettingsService)(); };
UiSettingsService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: UiSettingsService, factory: UiSettingsService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "c92J":
/*!*************************************!*\
  !*** ./src/app/database.service.ts ***!
  \*************************************/
/*! exports provided: DatabaseService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DatabaseService", function() { return DatabaseService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! idb */ "P0+2");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");



const db = Object(idb__WEBPACK_IMPORTED_MODULE_1__["openDB"])('books', 4, {
    upgrade(oldDb, oldVersion, newVersion, transaction) {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            switch (oldVersion) {
                case 0: {
                    const dataStore = oldDb.createObjectStore('data', {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    dataStore.createIndex('title', 'title');
                    oldDb.createObjectStore('bookmark', {
                        keyPath: 'dataId',
                    });
                    oldDb.createObjectStore('lastItem');
                    oldDb.createObjectStore('startingCharCount', {
                        keyPath: 'dataId',
                    });
                    break;
                }
                case 2: {
                    const dataStore = oldDb.createObjectStore('data', {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    dataStore.createIndex('title', 'title');
                    oldDb.createObjectStore('bookmark', {
                        keyPath: 'dataId',
                    });
                    oldDb.createObjectStore('lastItem');
                    oldDb.createObjectStore('startingCharCount', {
                        keyPath: 'dataId',
                    });
                    const oldDbV2 = oldDb;
                    const transactionV2 = transaction;
                    const oldValues = {
                        data: {},
                        scrollX: {},
                    };
                    {
                        let cursor = yield transactionV2.objectStore('keyvaluepairs').openCursor();
                        while (cursor) {
                            const regexResult = /([^\-]+)-(.+)/.exec(cursor.key);
                            if (regexResult) {
                                switch (regexResult[1]) {
                                    case 'data':
                                    case 'scrollX':
                                        oldValues[regexResult[1]][regexResult[2]] = cursor.value;
                                        break;
                                }
                            }
                            else if (cursor.key === 'lastItem') {
                                oldValues[cursor.key] = cursor.value;
                            }
                            cursor = yield cursor.continue();
                        }
                    }
                    yield Promise.all(Object.entries(oldValues.data).map(([key, valueString]) => Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
                        const parsedData = JSON.parse(valueString);
                        if (isFormattedDbV2Data(parsedData)) {
                            const dataId = yield transaction.objectStore('data').add(Object.assign(Object.assign({}, parsedData), { blobs: {} }));
                            const scrollX = oldValues.scrollX[key];
                            if (scrollX) {
                                yield transaction.objectStore('bookmark').put({
                                    dataId,
                                    scrollX: +scrollX,
                                });
                            }
                            if (oldValues.lastItem === key) {
                                transaction.objectStore('lastItem').put({
                                    dataId,
                                }, 0);
                            }
                        }
                    })));
                    oldDbV2.deleteObjectStore('keyvaluepairs');
                    oldDbV2.deleteObjectStore('local-forage-detect-blob-support');
                    break;
                }
                case 3: {
                    oldDb.createObjectStore('startingCharCount', {
                        keyPath: 'dataId',
                    });
                }
            }
        });
    }
});
class DatabaseService {
    constructor() {
        this.db = db;
    }
}
DatabaseService.ɵfac = function DatabaseService_Factory(t) { return new (t || DatabaseService)(); };
DatabaseService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({ token: DatabaseService, factory: DatabaseService.ɵfac, providedIn: 'root' });
function isFormattedDbV2Data(x) {
    if (typeof x === 'object' && x) {
        for (const key of ['title', 'elementHtml', 'styleSheet']) {
            // @ts-ignore
            if (!(key in x) || typeof x[key] !== 'string') {
                return false;
            }
        }
        return true;
    }
    return false;
}


/***/ }),

/***/ "dFyf":
/*!****************************************!*\
  !*** ./src/app/utils/smooth-scroll.ts ***!
  \****************************************/
/*! exports provided: SmoothScroll */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SmoothScroll", function() { return SmoothScroll; });
/**
 * @licence
 * Copyright (c) 2021, ッツ Reader Authors
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://stackoverflow.com/a/47206289
function SmoothScroll(target, smooth) {
    const scrollAxis = 'scrollLeft';
    let moving = false;
    let targetPos = target[scrollAxis];
    let expectedPos = target[scrollAxis];
    function update() {
        moving = true;
        const delta = Math.trunc((targetPos - target[scrollAxis]) / smooth);
        if (target[scrollAxis] !== expectedPos) {
            moving = false;
        }
        else {
            expectedPos += delta;
            target.scrollBy(delta, 0);
            if (Math.abs(delta) > 0) {
                window.requestAnimationFrame(update);
            }
            else {
                moving = false;
            }
        }
    }
    return (delta) => {
        if (!moving) {
            targetPos = target[scrollAxis];
            expectedPos = target[scrollAxis];
        }
        targetPos += delta;
        if (!moving) {
            update();
        }
    };
}


/***/ }),

/***/ "hXrI":
/*!****************************************!*\
  !*** ./src/app/utils/css-stringify.ts ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// @ts-nocheck
/* tslint:disable */
/**
 * Based on css parser/compiler by NxChg
 * https://github.com/NxtChg/pieces/tree/master/js/css_parser
 */
// Functions
// =============================================================================
/**
 * Compiles CSS AST to string
 *
 * @param {object}   tree CSS AST object
 * @param {string}   [delim=''] CSS rule delimiter
 * @param {function} cb Function to be called before each node is processed
 * @returns {string}
 */
function stringifyCss(tree, delim = '', cb) {
    const renderMethods = {
        charset(node) {
            return '@charset ' + node.name + ';';
        },
        comment(node) {
            // Preserve ponyfill marker comments
            return node.comment.indexOf('__CSSVARSPONYFILL') === 0 ? '/*' + node.comment + '*/' : '';
        },
        'custom-media'(node) {
            return '@custom-media ' + node.name + ' ' + node.media + ';';
        },
        declaration(node) {
            return node.property + ':' + node.value + ';';
        },
        document(node) {
            return '@' + (node.vendor || '') + 'document ' + node.document + '{' + visit(node.rules) + '}';
        },
        'font-face'(node) {
            return '@font-face' + '{' + visit(node.declarations) + '}';
        },
        host(node) {
            return '@host' + '{' + visit(node.rules) + '}';
        },
        import(node) {
            // FIXED
            return '@import ' + node.name + ';';
        },
        keyframe(node) {
            return node.values.join(',') + '{' + visit(node.declarations) + '}';
        },
        keyframes(node) {
            return '@' + (node.vendor || '') + 'keyframes ' + node.name + '{' + visit(node.keyframes) + '}';
        },
        media(node) {
            return '@media ' + node.media + '{' + visit(node.rules) + '}';
        },
        namespace(node) {
            return '@namespace ' + node.name + ';';
        },
        page(node) {
            return '@page ' + (node.selectors.length ? node.selectors.join(', ') : '') + '{' + visit(node.declarations) + '}';
        },
        'page-margin-box'(node) {
            return '@' + node.name + '{' + visit(node.declarations) + '}';
        },
        rule(node) {
            const decls = node.declarations;
            if (decls.length) {
                return node.selectors.join(',') + '{' + visit(decls) + '}';
            }
        },
        supports(node) {
            // FIXED
            return '@supports ' + node.supports + '{' + visit(node.rules) + '}';
        }
    };
    function visit(nodes) {
        let buf = '';
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            if (cb) {
                cb(n);
            }
            const txt = renderMethods[n.type](n);
            if (txt) {
                buf += txt;
                if (txt.length && n.selectors) {
                    buf += delim;
                }
            }
        }
        return buf;
    }
    return visit(tree.stylesheet.rules);
}
// Exports
// =============================================================================
/* harmony default export */ __webpack_exports__["default"] = (stringifyCss);


/***/ }),

/***/ "kjHl":
/*!******************************************!*\
  !*** ./src/app/theme-manager.service.ts ***!
  \******************************************/
/*! exports provided: ThemeManagerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThemeManagerService", function() { return ThemeManagerService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class ThemeManagerService {
    constructor() {
        this.themeIndex = -1;
        this.availableThemes = [
            'light-theme',
            'ecru-theme',
            'water-theme',
            'gray-theme',
            'dark-theme',
            'black-theme',
        ];
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            this.themeIndex = this.availableThemes.findIndex((x) => x === storedTheme);
        }
        if (this.themeIndex < 0) {
            this.themeIndex = 0;
        }
        document.documentElement.classList.add(this.availableThemes[this.themeIndex]);
    }
    setTheme(themeIndex) {
        const previousTheme = this.availableThemes[this.themeIndex];
        this.themeIndex = themeIndex;
        const currentTheme = this.availableThemes[this.themeIndex];
        document.documentElement.classList.replace(previousTheme, currentTheme);
        localStorage.setItem('theme', currentTheme);
    }
}
ThemeManagerService.ɵfac = function ThemeManagerService_Factory(t) { return new (t || ThemeManagerService)(); };
ThemeManagerService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: ThemeManagerService, factory: ThemeManagerService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "lgdk":
/*!**********************************************!*\
  !*** ./src/app/utils/local-storage-utils.ts ***!
  \**********************************************/
/*! exports provided: getStoredBooleanOrDefault, getStoredNumberOrDefault, createBooleanLocalStorageBehaviorSubject, createNumberLocalStorageBehaviorSubject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStoredBooleanOrDefault", function() { return getStoredBooleanOrDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStoredNumberOrDefault", function() { return getStoredNumberOrDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createBooleanLocalStorageBehaviorSubject", function() { return createBooleanLocalStorageBehaviorSubject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNumberLocalStorageBehaviorSubject", function() { return createNumberLocalStorageBehaviorSubject; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/**
 * @licence
 * Copyright (c) 2021, ッツ Reader Authors
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


function getStoredBooleanOrDefault(key, defaultVal) {
    const storedVal = localStorage.getItem(key);
    return storedVal != null ? !!(+storedVal) : defaultVal;
}
function getStoredNumberOrDefault(key, defaultVal) {
    const storedVal = localStorage.getItem(key);
    return storedVal != null ? +storedVal : defaultVal;
}
function createBooleanLocalStorageBehaviorSubject(key, defaultVal) {
    const initVal = getStoredBooleanOrDefault(key, defaultVal);
    const behaviorSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](initVal);
    behaviorSubject.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["skip"])(1)).subscribe((updatedVal) => {
        localStorage.setItem(key, updatedVal ? '1' : '0');
    });
    return behaviorSubject;
}
function createNumberLocalStorageBehaviorSubject(key, defaultVal) {
    const initVal = getStoredNumberOrDefault(key, defaultVal);
    const behaviorSubject = new rxjs__WEBPACK_IMPORTED_MODULE_0__["BehaviorSubject"](initVal);
    behaviorSubject.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["skip"])(1)).subscribe((updatedVal) => {
        localStorage.setItem(key, `${updatedVal}`);
    });
    return behaviorSubject;
}


/***/ }),

/***/ "ovA6":
/*!*********************************************!*\
  !*** ./src/app/bookmark-manager.service.ts ***!
  \*********************************************/
/*! exports provided: BookmarkManagerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BookmarkManagerService", function() { return BookmarkManagerService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _database_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./database.service */ "c92J");
/* harmony import */ var _scroll_information_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scroll-information.service */ "wm/D");




class BookmarkManagerService {
    constructor(databaseService, scrollInformationService) {
        this.databaseService = databaseService;
        this.scrollInformationService = scrollInformationService;
        this.identifier = NaN;
        this.el = document.createElement('div');
        this.el.classList.add('bookmark-cover');
        this.el.hidden = true;
    }
    scrollToSavedPosition() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const targetScrollX = yield this.getBookmarkPosition();
            if (targetScrollX !== undefined) {
                window.scrollTo(targetScrollX, 0);
                this.el.style.right = `${-targetScrollX}px`;
                this.el.hidden = false;
            }
        });
    }
    saveScrollPosition() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const db = yield this.databaseService.db;
            void db.put('bookmark', {
                dataId: this.identifier,
                scrollX: window.scrollX,
                exploredCharCount: this.scrollInformationService.exploredCharCount,
            });
            this.el.style.right = `${-window.scrollX}px`;
            this.el.hidden = false;
        });
    }
    refreshBookmarkBarPosition() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const targetScrollX = yield this.getBookmarkPosition();
            if (targetScrollX !== undefined) {
                this.el.style.right = `${-targetScrollX}px`;
            }
        });
    }
    getBookmarkPosition() {
        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"])(this, void 0, void 0, function* () {
            const db = yield this.databaseService.db;
            const bookmark = yield db.get('bookmark', this.identifier);
            if (bookmark) {
                let targetScrollX;
                if (bookmark.exploredCharCount) {
                    if (this.scrollInformationService.getCharCount(Math.abs(bookmark.scrollX)) === bookmark.exploredCharCount) {
                        targetScrollX = bookmark.scrollX;
                    }
                    else {
                        targetScrollX = this.scrollInformationService.getScrollPos(bookmark.exploredCharCount);
                    }
                }
                else {
                    targetScrollX = bookmark.scrollX;
                }
                return targetScrollX;
            }
            return undefined;
        });
    }
}
BookmarkManagerService.ɵfac = function BookmarkManagerService_Factory(t) { return new (t || BookmarkManagerService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_database_service__WEBPACK_IMPORTED_MODULE_2__["DatabaseService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_scroll_information_service__WEBPACK_IMPORTED_MODULE_3__["ScrollInformationService"])); };
BookmarkManagerService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: BookmarkManagerService, factory: BookmarkManagerService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _reader_reader_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reader/reader.component */ "HMgo");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "fXoL");




const routes = [
    {
        path: 'b/:identifier',
        component: _reader_reader_component__WEBPACK_IMPORTED_MODULE_1__["ReaderComponent"],
    },
    {
        path: '**',
        redirectTo: '',
    }
];
class AppRoutingModule {
}
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({ factory: function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes, {
                initialNavigation: 'enabled',
                useHash: true,
            })], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "wm/D":
/*!***********************************************!*\
  !*** ./src/app/scroll-information.service.ts ***!
  \***********************************************/
/*! exports provided: ScrollInformationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScrollInformationService", function() { return ScrollInformationService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _ebook_display_manager_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ebook-display-manager.service */ "7n3V");



class ScrollInformationService {
    constructor(ebookDisplayManagerService, zone) {
        // this.el.classList.add('information-overlay', 'bottom-overlay', 'scroll-information');
        this.ebookDisplayManagerService = ebookDisplayManagerService;
        this.zone = zone;
        // el = document.createElement('div');
        // el: HTMLDivElement = document.getElementById("scroll-info") as HTMLDivElement;
        // els = document.getElementsByClassName("scroll-information");
        /**
         * Doesn't matter what's returned here, just placeholder
         */
        this.paragraphs = [];
        this.paragraphPos = Array(this.paragraphs.length);
        this.charCount = Array(this.paragraphs.length);
        this.exploredCharCount = 0;
        this.exploredCharCountUpdated$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__["Subject"]();
        // this.zone.runOutsideAngular(() => {
        //   let visible = true;
        //   this.el.addEventListener('click', () => {
        //     if (visible) {
        //       this.el.style.opacity = '0';
        //     } else {
        //       this.el.style.removeProperty('opacity');
        //     }
        //     visible = !visible;
        //   });
        // });
    }
    updateParagraphPos() {
        this.paragraphPos = [];
        this.charCount = [];
        let exploredCharCount = 0;
        for (const el of this.paragraphs) {
            this.paragraphPos.push(document.documentElement.offsetWidth - el.offsetLeft);
            exploredCharCount += this.ebookDisplayManagerService.getCharCount(el);
            this.charCount.push(exploredCharCount);
        }
    }
    initWatchParagraphs(el) {
        this.paragraphs = el.getElementsByTagName('p');
        if (this.paragraphs.length === 0) {
            const potentialParagraphs = Array.from(el.querySelectorAll('*'))
                .filter((p) => {
                var _a;
                return p instanceof HTMLElement
                    && !p.attributes.getNamedItem('aria-hidden')
                    && ((_a = p.parentElement) === null || _a === void 0 ? void 0 : _a.tagName) !== 'RUBY';
            })
                .filter((p) => {
                for (const pChild of p.childNodes) {
                    if (pChild.nodeType === Node.TEXT_NODE && pChild.textContent && pChild.textContent.trim().length > 0) {
                        return true;
                    }
                }
                return false;
            });
            const potentialParagraphsSet = new Set(potentialParagraphs);
            // tslint:disable-next-line:no-non-null-assertion
            this.paragraphs = potentialParagraphs.filter((p) => !potentialParagraphsSet.has(p.parentElement));
        }
    }
    calcExploredCharCount() {
        const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        return this.getCharCount(Math.abs(scrollLeft));
    }
    updateScrollPercent(totalCharCount) {
        this.exploredCharCount = this.calcExploredCharCount();
        const el = document.getElementById("scroll-info");
        el.innerText = `${this.exploredCharCount}/${totalCharCount} (${((this.exploredCharCount / totalCharCount) * 100).toFixed(2)}%)`;
        this.exploredCharCountUpdated$.next();
    }
    updateScrollPercentByCharCount(totalCharCount, charCount) {
        this.exploredCharCount = charCount;
        const el = document.getElementById("scroll-info");
        el.innerText = `${this.exploredCharCount}/${totalCharCount} (${((this.exploredCharCount / totalCharCount) * 100).toFixed(2)}%)`;
        this.exploredCharCountUpdated$.next();
    }
    getCharCount(scrollPos) {
        const index = binarySearch(this.paragraphPos, 0, this.paragraphPos.length - 1, scrollPos);
        return this.charCount[index] || 0;
    }
    getScrollPos(charCount) {
        const index = binarySearch(this.charCount, 0, this.charCount.length - 1, charCount);
        return -this.paragraphPos[index];
    }
}
ScrollInformationService.ɵfac = function ScrollInformationService_Factory(t) { return new (t || ScrollInformationService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_ebook_display_manager_service__WEBPACK_IMPORTED_MODULE_2__["EbookDisplayManagerService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"])); };
ScrollInformationService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: ScrollInformationService, factory: ScrollInformationService.ɵfac, providedIn: 'root' });
function binarySearch(arr, l, r, x) {
    if (r >= l) {
        const mid = Math.floor((l + r) / 2);
        if (arr[mid] === x) {
            return mid;
        }
        if (arr[mid] > x) {
            return binarySearch(arr, l, mid - 1, x);
        }
        return binarySearch(arr, mid + 1, r, x);
    }
    return r;
}


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");
/**
 * @licence
 * Copyright (c) 2021, ッツ Reader Authors
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map