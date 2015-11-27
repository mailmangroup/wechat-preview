/*
 * WeChat Preview
 * Author: Fergus Jordan
 * Version: 1.0.10
 *
 * Preview of content in WeChat's iOS app
 */
(function ( root, factory ) {

	// AMD
	if ( typeof define === 'function' && define.amd ) define( [], factory );

	// COMMONJS
	else if ( typeof exports === 'object' ) module.exports = factory();

	// BROWSER GLOBAL
	else root.wechatPreview = factory();

}(this, function () {
	'use strict';

	// DECLARE ACCEPTED CONTAINER SIZES
	var sizes = {
		iphone4: {
			height: '480px',
			width: '320px'
		},
		iphone5: {
			height: '568px',
			width: '320px'
		},
		iphone6: {
			height: '667px',
			width: '375px'
		},
		iphone6plus: {
			height: '736px',
			width: '414px'
		}
	};

	// EXTEND JAVASCRIPT OBJECT
	function extend ( defaults, options ) {

	    var extended = {};
	    var prop;

	    for (prop in defaults) {
	        if (Object.prototype.hasOwnProperty.call(defaults, prop)) extended[prop] = defaults[prop];
	    }

	    for (prop in options) {
	    	if (Object.prototype.hasOwnProperty.call(options, prop) ) extended[prop] = options[prop];
	    }

	    return extended;

	};

	// CONVERT STRING TO LOWERCASE AND STRIP SPACES TO ENSURE INPUT MATCHES ACCEPTED SIZES
	function normalizeString ( string ) {

		var normalized = string.toLowerCase().replace(/ /g,'');
		return normalized;

	};

	// CREATE CLASS HELPER FUNCTION
	// ===============================================================================
	// HAS CLASS
	function hasClass ( el, className ) {

		if (el.classList) return el.classList.contains(className);
		else return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);

	}
	// ADD CLASS
	function addClass( el, className ) {

		if (el.classList) el.classList.add(className);
		else el.className += ' ' + className;

	}
	// REMOVECLASS
	function removeClass( el, className ) {

		if (el.classList) el.classList.remove(className);
		else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

	}

	// REGEX TO WRAP ENGLISH IN SPANS FOR LETTER SPACING
	// ===============================================================================
	function englishCharSpacing ( string ) {

		if ( string ) {
			return string = string.replace( /(\w+)([\w\s#!:,.?+=&%@!\-\/]+)?/g, function( match ) {
				return '<span class="wcp-en">' + match + '</span>';
			});
		}

	}


	// DECLARE CREATE ELEMENT FUNCTION
	// ===============================================================================
	function createElement ( element, className, target ) {

		element = document.createElement( element );
		if ( className ) element.className = className;
		if ( target ) target.appendChild( element );

		return element;

	}


	// PREVIEW CLASS CONSTRUCTOR
	// ===============================================================================
	function wechatPreview ( options ) {

		// ENSURE THAT THE CLASS IS CALLED WITH THE `new` CONSTRUCTOR
		if ( !( this instanceof wechatPreview ) ) {
			throw new TypeError( 'wechatPreview constructor cannot be called as a function.' );
		}

		// NEW PREVIEW OBJECT
		options = extend({
			container: false
		}, options);

		// BUILD CONTAINER ELEMENT
		// ===========================================================================
		if ( options.container ) {

			this.el = createElement( 'div', 'wcp' );
			// CREATE MAIN DIV
			this.main = createElement( 'div', 'wcp-main', this.el );
			// CREATE EMPTY POST WRAPPER AND APPANED TO MAIN
			this.postWrapper = createElement( 'div', 'wcp-post-wrapper wcp-empty', this.main );
			// CREATE TIMESTAMP AND APPEND TO POST WRAPPER
			this.timestamp = createElement( 'div', 'wcp-timestamp', this.postWrapper );

		} else if ( !options.container ) {

			this.el = createElement( 'div' );
			this.postWrapper = createElement( 'div', false, this.el );

		}

		// CREATE CONTENT WRAPPER AND APPEND TO POST WRAPPER
		this.contentWrapper = createElement( 'div', 'wcp-content-wrapper', this.postWrapper );

		if ( !options.container )
			addClass( this.contentWrapper, 'wcp-gallery' );


		// IF CONTAINER IS AN OBJECT > OBJECT VALUES MUST BE HEIGHT AND WIDTH
		// ===========================================================================
		if ( typeof options.container === 'object' && options.container.width && options.container.height ) {

			if ( typeof options.container.width === 'number' && typeof options.container.height === 'number' ) {

				options.container.width = options.container.width + 'px';
				options.container.minHeight = options.container.height + 'px';

			}

			this.el.style.width = options.container.width;
			this.el.style.minHeight = options.container.height;

		}

		// IF CONTAINER IS AN STRING > SET HEIGHT AND WIDTH ACCORDING TO WHITELIST SIZES
		// ===========================================================================
		else if ( typeof options.container == 'string' ) {

			for ( var prop in sizes ) {

				if ( sizes.hasOwnProperty( prop ) && prop == normalizeString( options.container ) ) {

					this.el.style.width = sizes[ prop ].width;
					this.el.style.minHeight = sizes[ prop ].height;

				}

			}

		} else if ( typeof options.container != 'boolean' ) throw new TypeError( 'Container object contains invalid values' );

	};

	// DECLARE ARTICLE CREATOR FUNCTION
	// =========================================================================
	wechatPreview.prototype.article = function ( articleContent, iterator, articleContainer ) {

		// IF THERE ARE NO PREVIOUS VALUES > CREATE ARTICLES
		if ( !this.previous ) this.articles[ iterator ] = createElement( 'div', 'wcp-article', articleContainer );

		// IF THERE IS NO PREVIOUS VALUE FOR THE SPECIFIC ARTICLE > CREATE THE SPECIFIC ARTICLE
		else if ( this.previous && !this.previous.articles[ iterator ] ) this.articles[ iterator ] = createElement( 'div', 'wcp-article', articleContainer );

		// ATTACH TO ANONYMOUS VARIABLE
		var article = this.articles[ iterator ];

		// NORMAL ELEMENTS
		// =====================================================================

		if ( article && !article.articleTitleEl ) article.articleTitleEl = createElement( 'div', 'wcp-article-title', article );
		if ( article && !article.articleTitle ) article.articleTitle = createElement( 'p', false, article.articleTitleEl );
		if ( article && !article.articleDateEl ) article.articleDateEl = createElement( 'span', 'wcp-article-date', article );
		if ( article && !article.articleImageEl ) article.articleImageEl = createElement( 'div', 'wcp-article-image', article );
		if ( article && !article.articleDescriptionEl ) article.articleDescriptionEl = createElement( 'div', 'wcp-article-description', article );
		if ( article && !article.readAllEl ) article.readAllEl = createElement( 'div', 'wcp-read-all', article );
		if ( article && !article.readAll ) article.readAll = createElement( 'span', false, article.readAllEl );

		// SHADOW ELEMENT
		// =====================================================================
		if ( articleContent.shadow ) {
			// IF NO ARTICLE EXISTS > CREATE THE ARTICLE
			if ( !this.shadowContent ) this.shadowContent = createElement( 'div', 'wcp-shadow-content', article );
			if ( this.shadowContent && this.shadowContent.parentNode != article ) article.appendChild( this.shadowContent );
			addClass( article, 'wcp-shadow' );
		} else if ( article && !articleContent.shadow ) {
			removeClass( article, 'wcp-shadow' );
		}

		// SET INNER HTML IF POST TYPE ISNT EMPTY
		if ( articleContent && article ) {

			// SET ARTICLE TITLE
			article.articleTitle.innerHTML = englishCharSpacing( articleContent.title );

			// SET ARTICLE DATE
			article.articleDateEl.innerHTML = this.articleDate;

			// SET ARTICLE IMAGE
			if ( !article.articleImage ) article.articleImage = createElement( 'img', false, article.articleImageEl );
			if ( articleContent.image )	article.articleImage.setAttribute( 'src', articleContent.image );

			// SET ARTICLE DESCRIPTION
			article.articleDescriptionEl.innerHTML = articleContent.description;

			// SET ARTICLE READ ALL
			article.readAll.innerHTML = '阅读原文';

		} else if ( !articleContent ) {

			if ( article.articleTitle ) article.articleTitle.innerHTML = '';
			if ( article.articleDateEl ) article.articleDateEl.innerHTML = '';
			if ( article.articleImage ) article.articleImage.removeAttribute( 'src' );
			if ( article.articleDescriptionEl ) article.articleDescriptionEl.innerHTML = '';
			if ( article.readAll ) article.readAll.innerHTML = '';

			// CREATE THREE EMPTY ARTICLE LINES
			for ( var i = 0; i < 3; i++ ) createElement( 'div', 'wcp-text-line', article.articleDescriptionEl );

		}

		return article;

	};

	// GENERATE THE CONTENT OF THE PREVIEW
	// ============================================================================
	wechatPreview.prototype.generate = function ( content ) {

		// SET CONTENT
		// =========================================================================

		// SET INITIAL DEFAULT VALUES
		var defaults = {
			postTime: new Date(),
			articles: []
		};

		// IF CONTENT HAS ARTICLES SET > PUSH DEFAULT VALUES FOR THE LENGTH OF ARTICLES
		content = extend( defaults, content );

		if ( content.articles ) {

			for ( var i = 0; i < content.articles.length; i++ ) {

				if ( !this.previous ) {

					content.articles[ i ] = extend({
						title: '微博正文',
						description: '摘要',
						image: null,
						shadow: false
					}, content.articles[ i ]);

				} else if ( this.previous ) {

					if ( this.previous.articles[ i ] ) {

						content.articles[ i ] = extend( {

							title: this.previous.articles[ i ].title,
							description: this.previous.articles[ i ].description,
							image: this.previous.articles[ i ].image,
							shadow: false

						}, content.articles[ i ] );

					}

					content = extend( this.previous, content );

				}

			}

		}

		// CREATE EMPTY ARTICLES ARRAY
		if ( !this.articles ) this.articles = [];

		// FORMAT THE DATE
		// =========================================================================
		if ( content.postTime ) {

			// SET DATE VARIABLES
			// ----------------------------------------------------------------------
			var	weekDayName = [ '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ],
				monthName = [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ],
				date = new Date( content.postTime ),
				setDate = date.getDate(),
				now = new Date(),
				nowDate = now.getDate(),
				day = date.getDay(),
				nowDay = now.getDay(),
				dayAbbr = setDate + '日',
				dayDifference = nowDate - setDate,
				weekDay = weekDayName[ day ],
				month = date.getMonth(),
				nowMonth = now.getMonth(),
				monthAbbr = monthName[ month ],
				year = date.getFullYear(),
				hour = ( '0' + date.getHours() ).slice( -2 ),
				minute = ( '0' + date.getMinutes() ).slice( -2 ),
				clock = hour + ':' + minute;

			// FORMAT DATE
			// ----------------------------------------------------------------------
			// THE DATE IS TODAY
			if ( nowDate == setDate && month == nowMonth )
				this.postDate = clock;

			// THE DATE IS YESTERDAY
			else if ( day == nowDay - 1 && dayDifference < 7 )
				this.postDate = '昨天 ' + clock;

			// WITHIN LAST 7 DAYS
			else if ( dayDifference < 7 && dayDifference > 0 )
				this.postDate = weekDay + ' ' + clock;

			// OUTSIDE OF LAST 7 DAYS
			else this.postDate = year + '年' + monthAbbr + dayAbbr + ' ' + clock;

			// SET CONTENT
			// ----------------------------------------------------------------------
			if ( !this.articleDate ) this.articleDate = monthAbbr + dayAbbr;
			if ( this.timestamp ) this.timestamp.innerHTML = this.postDate;

		}

		// IF THERE ARE NO ARTICLES > CREATE THE EMPTY POST
		// =========================================================================
		if ( !content.articles || content.articles.length == 0 ) {

			addClass( this.postWrapper, 'wcp-empty' );

			if ( this.articles[ 0 ] ) this.contentWrapper.removeChild( this.articles[ 0 ] );
			this.articles[ 0 ] = this.article( false, 0, false );
			if ( this.articles[ 0 ].parentNode != this.contentWrapper ) this.contentWrapper.appendChild( this.articles[ 0 ] );

			addClass( this.articles[ 0 ], 'wcp-single' );
			this.timestamp.innerHTML = '';

		}

		// IF THERE IS THE CORRECT AMOUNT OF ARTICLES > CREATE THE ARTICLES
		// =========================================================================
		if ( content.articles && content.articles.length > 0 ) {

			// IF THE POST WRAPPER HAS PREVIOUSLY SET CLASSES > REMOVE THEM
			if ( this.articles[ 0 ] && hasClass( this.postWrapper, 'wcp-empty' ) ) this.contentWrapper.removeChild( this.articles[ 0 ] );
			removeClass( this.postWrapper, 'wcp-empty' );

			// REMOVE ANY PREVIOUS ARTICLES WHOS VALUE WONT GET OVERWRITTEN
			// =========================================================================
			if ( this.previous ) {

				for ( var a = 0; a < this.previous.articles.length; a++ ) {

					if ( a >= content.articles.length ) this.contentWrapper.removeChild( this.articles[ a ] );

				}

			}

			if ( content.articles.length > 1 ) removeClass( this.contentWrapper, 'wcp-gallery' );

			// LOOP THROUGH ARTICLES TO CREATE
			for ( var i = 0; i < content.articles.length && i < 9; i++ ) {

				this.articles[ i ] = this.article( content.articles[ i ], i, this.contentWrapper );

				if ( this.articles[ i ] && this.articles[ i ].parentNode != this.contentWrapper ) this.contentWrapper.appendChild( this.articles[ i ] );

				// IF IT IS THE FIRST ARTICLE OF MULTIPLE ARTICLES > ADD THE TOP CLASSNAME
				if ( i == 0 && content.articles.length > 1 ) {
					removeClass( this.articles[ 0 ], 'wcp-single' );
					addClass( this.articles[ 0 ], 'wcp-top' );
				}

				// IF IT IS THE ONLY ARTICLE > ADD THE SINGLE CLASSNAME
				else if ( content.articles.length == 1 || hasClass( this.contentWrapper, 'wcp-gallery' ) ) {
					removeClass( this.articles[ 0 ], 'wcp-top' );
					addClass( this.articles[ 0 ], 'wcp-single' );
				}

				// IF NOT THE FIRST ARTICLE > ADD THE NORMAL CLASSNAME
				else addClass( this.articles[ i ], 'wcp-normal' );

			}

			this.previous = content;

		}

	}

	return wechatPreview;

}));