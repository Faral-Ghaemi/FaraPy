(function ($) {
	
	$.extend($.stCore, {
		
		//Init tab touch
		initTabTouch:function() {
			if (this.val.isTouch) {
				this.setTabSwipeLength();
				this.tabs.maxXY = this.opt.offsetBR;
				this.bindTabTouch();
				this.tabs.isAnim = false;
				this.tabs.dist = 0;
			}
		},
		
		//Set tab swipe length
		setTabSwipeLength:function() {
			var totalTabsW = this.getTotalTabsLength();
			var limitXY = (totalTabsW-this.val.tabsSlideLength);
			this.tabs.minXY = -(limitXY+this.opt.offsetTL);
		},
		
		//Bind tab touch
		bindTabTouch:function() {
			var that = this;
			this.$a.unbind("dragstart").bind("dragstart", function() {
				return false;
			});
			this.$tabsInnerCont.unbind("touchstart").bind("touchstart", function(e) {
				that.tabTouchStart(e);
			})
		},
		
		//Unbind tab touch
		unbindTabTouch:function() {
			this.$tabsInnerCont.unbind("touchstart");
		},
		
		//Tab touch start
		tabTouchStart:function(e) {
			if (this.tabs.isAnim) {
				e.preventDefault();
				return false;
			}
			
			var that = this;
			var te = e.originalEvent.touches;
			
			if (te && te.length==1) {
				this.e = te[0];
			} else {
				return false;
			}
			
			this.$doc.bind("touchmove", function(e) {
				that.tabTouchMove(e);
			});
			
			this.$doc.bind("touchend", function(e) {
				that.tabTouchEnd(e);
			});
			
			if (this.val.useWebKit) {
				this.$tabs.css("-webkit-transition-duration", "0");
			}
			
			this.tabs.eXY = this.tabs.start = this.e[this.val.clientXY];
			
			if (this.val.useWebKit) {
				this.tabs.startXY = this.tabWebKitPosition(this.$tabs, this.val.arrPos);
			} else {
				this.tabs.startXY = parseInt(this.$tabs.css(this.val.css));
			}
			
			this.tabs.minMouseXY = this.tabs.eXY-this.tabs.startXY+this.tabs.minXY;
			this.tabs.maxMouseXY = this.tabs.minMouseXY+this.tabs.maxXY-this.tabs.minXY;
			this.tabs.acc = this.tabs.startXY;
			this.tabs.startTs = Date.now();
			
			return false;
		},
		
		//Tab touch move
		tabTouchMove:function(a) {
			e.preventDefault();
			var te = e.originalEvent.touches;
			
			if (te.length>1) {
				return false;
			}
			
			this.e = te[0];
			var xy = this.tabs.end = this.e[this.val.clientXY];
			xy = Math.max(xy, this.tabs.minMouseXY);
			xy = Math.min(xy, this.tabs.maxMouseXY);
			this.tabs.lastPos = this.tabs.currPos;
			this.tabs.dist = xy-this.tabs.eXY;
			
			if (this.tabs.lastPos!=this.tabs.dist) {
				this.tabs.currPos = this.tabs.dist;
			}
			
			this.tabs.newXY = this.tabs.startXY+this.tabs.dist;
			
			if (Math.abs(this.tabs.end-this.tabs.eXY)>0) {
				this.setTabIsAnim(true, "pause");
			}
			
			this.$tabs.css(this.val.css, this.val.pre+this.tabs.newXY+this.val.px);
			
			var now = Date.now();
			
			if (now-this.tabs.startTs>350) {
				this.tabs.startTs = now;
				this.tabs.acc = this.tabs.startXY+this.tabs.dist;
			}
			
			return false;
		},
		
		//Tab touch end
		tabTouchEnd:function(e) {
			this.$doc.unbind('touchmove').unbind('touchend');
			
			if (this.val.useWebKit) {
				this.tabs.endXY = this.tabWebKitPosition(this.$tabs, this.val.arrPos)
			} else {
				this.tabs.endXY = parseInt(this.$tabs.css(this.val.css))
			}
			
			this.tabs.endXY = (isNaN(this.tabs.endXY)) ? 0 : this.tabs.endXY;
			this.margin = Math.abs(this.tabs.endXY);
			var that = this;
			var dist = Math.abs(this.tabs.dist);
			
			if (!dist) {
				if (this.margin==this.opt.offsetTL) {
					setTimeout(function() {
						that.tabs.isAnim = false;
					}, 100);
				} else if (this.margin == Math.abs(this.tabs.minXY)) {
					setTimeout(function() {
						that.tabs.isAnim = false;
					}, 100);
				}
				return false;
			}
			
			var diff = Math.max(40, (Date.now())-this.tabs.startTs);
			var accDist = Math.abs(this.tabs.acc-this.tabs.endXY);
			var speed = accDist/diff;
			var subtDist = Math.abs(this.val.tabsSlideLength-dist);
			this.tabs.swipeSpeed = Math.max((subtDist)/speed, 200);
			this.tabs.swipeSpeed = Math.min(this.tabs.swipeSpeed, 600);
			this.tabs.swipeSpeed = (isNaN(this.tabs.swipeSpeed)) ? 300 : this.tabs.swipeSpeed;
			
			if (!this.margin) {
				if (this.opt.buttonsFunction=="slide" && !this.opt.tabsLoop) {
					this.disableTabButton(this.$prev);
					this.enableTabButton(this.$next);
				}
				setTimeout(function () {
					that.setTabIsAnim(false, "resume");
				}, 100);
				return false;
			} else if (this.margin==Math.abs(this.tabs.minXY)) {
				if (this.opt.buttonsFunction=="slide" && !this.opt.tabsLoop) {
					this.disableTabButton(this.$next);
					this.enableTabButton(this.$prev);
				}
				setTimeout(function () {
					that.setTabIsAnim(false, "resume");
				}, 100);
				return false;;
			}
			
			if (dist>30) {
				if (this.tabs.start>this.tabs.end) {
					if (this.tabs.lastPos<this.tabs.currPos) {
						this.slideTabBack(this.tabs.swipeSpeed);
						return false;
					}
					this.slideNextTab(this.tabs.swipeSpeed);
				} else if (this.tabs.start<this.tabs.end) {
					if (this.tabs.lastPos>this.tabs.currPos) {
						this.slideTabBack(this.tabs.swipeSpeed);
						return false;
					}
					this.slidePrevTab(this.tabs.swipeSpeed);
				} else {
					this.slideTabBack(200);
				}
			} else {
				this.slideTabBack(200);
			}
			
			this.tabs.dist = 0;
			
			return false;
		},
		
		//Slide tab back
		slideTabBack:function(speed) {
			var that = this;
			
			if (this.val.useWebKit) {
				this.bindTabWebKitCallback();
				this.$tabs.css({
					"-webkit-transition-duration":speed+"ms",
					"-webkit-transition-timing-function":"ease-out"
				}).css(this.val.css, this.val.pre+this.tabs.startXY+this.val.px);
			} else {
				if (this.opt.orientation=="horizontal") {
					this.$tabs.animate({
						"marginLeft":this.tabs.startXY+"px"
					}, speed, "easeOutSine", function() {
						that.setTabIsAnim(false, "resume");
					});
				} else {
					this.$tabs.animate({
						"marginTop":this.tabs.startXY+"px"
					}, speed, "easeOutSine", function() {
						that.setTabIsAnim(false, "resume");
					});
				}
			}
			
			this.margin = Math.abs(this.tabs.startXY);
		},
		
		//Init content touch
		initContentTouch:function() {
			if (this.val.isTouch) {
				if (this.$a.length>1 && this.content.animIsSlide) {
					this.content.isTouch = true;
					this.content.startEvent = "touchstart";
					this.content.moveEvent = "touchmove";
					this.content.endEvent = "touchend";
					this.content.cancelEvent = "touchcancel";
					this.bindContentTouch();
				}
			}
		},
		
		//Bind content touch
		bindContentTouch:function() {
			var that = this;
			
			this.$contentCont.find("."+this.opt.classNoTouch).unbind("mousedown").unbind('touchstart').bind("mousedown touchstart", function(e) {
				e.stopImmediatePropagation();
			});
			
			this.$views.unbind(this.content.startEvent).bind(this.content.startEvent, function(e) {
				that.contentTouchStart(e);
			})
		},
		
		//Unbind content touch
		unbindContentTouch:function() {
			this.content.isTouch = false;
			this.$views.unbind(this.content.startEvent);
		},
		
		//Slide content back
		slideContentBack:function(speed) {
			this.content.isAnim = true;
			var that = this;
			
			if (this.val.useWebKit) {
				this.bindContentWebKitCallback(true);
				this.$currentView.css({
					"-webkit-transition-duration":speed+"ms",
					"-webkit-transition-timing-function":"ease-out"
				}).css(this.content.css, this.content.pre+"0"+b.content.px);
				this.$prevView.css({
					"-webkit-transition-duration":speed+"ms",
					"-webkit-transition-timing-function":"ease-out"
				}).css(this.content.css, this.content.pre-this.content.slideLength+this.content.px);
				this.$nextView.css({
					"-webkit-transition-duration":speed+"ms",
					"-webkit-transition-timing-function":"ease-out"
				}).css(this.content.css, this.content.pre+this.content.slideLength+this.content.px);
			} else {
				if (this.opt.contentAnim=="slideV") {
					this.$prevView.animate({"top":-this.content.slideLength+"px"}, speed, "easeOutSine");
					this.$nextView.animate({"top":this.content.slideLength+"px"}, speed, "easeOutSine");
					this.$currentView.animate({"top":"0px"}, speed, "easeOutSine", function() {
						that.setContentIsAnim(false, "resume");
						that.slideContentBackRePos();
					});
				} else {
					this.$prevView.animate({"left":-this.content.slideLength+"px"}, speed, "easeOutSine");
					this.$nextView.animate({"left":this.content.slideLength+"px"}, speed, "easeOutSine");
					this.$currentView.animate({"left":"0px"}, speed, "easeOutSine", function() {
						that.setContentIsAnim(false, "resume");
						that.slideContentBackRePos();
					});
				}
			}
		},
		
		//Slide content back repos
		slideContentBackRePos:function() {
			if (this.val.useWebKit) {
				this.$prevView.css("-webkit-transition-duration", "0ms");
				this.$nextView.css("-webkit-transition-duration", "0ms");
			}
			this.$prevView.css(this.content.css, this.content.pre+this.opt.viewportOffset+this.content.px);
			this.$nextView.css(this.content.css, this.content.pre+this.opt.viewportOffset+this.content.px);
		},
		
		//Content touch start
		contentTouchStart:function(e) {
			if (this.content.isAnim || this.tabs.isAnim || this.tabs.xhr) {
				return false;
			}
			
			if (this.content.isMoving) {
				return false;
			}
			
			var that = this;
			var te = e.originalEvent.touches;
			
			if (te && te.length>0) {
				this.e = te[0];
				this.content.isMoving = true;
			} else {
				return false;
			}
			
			if (this.opt.autoplay) {
				this.pauseAutoPlay(false);
			}
			
			this.content.dirCheck = false;
			
			this.$doc.bind(this.content.moveEvent, function (e) {
				that.contentTouchMove(e);
			});
			
			this.$doc.bind(this.content.endEvent, function (e) {
				that.contentTouchEnd(e);
			});
			
			this.$prevView = this.$currentView.prev("div");
			this.$nextView = this.$currentView.next("div");
			var xy = parseInt(this.$contentCont.css(this.content.wh));
			this.content.minXY = -xy;
			this.content.maxXY = xy;
			this.content.prevViewWH = -this.$prevView[this.content.owh](false);
			this.content.nextViewWH = this.$contentCont[this.content.wh]();
			
			if (this.val.useWebKit) {
				this.$currentView.css("-webkit-transition-duration", "0");
				this.$prevView.css("-webkit-transition-duration", "0");
				this.$nextView.css("-webkit-transition-duration", "0");
			}
			
			this.content.eX = this.e.pageX;
			this.content.eY = this.e.pageY;
			this.content.eXY = this.content.start = this.e[this.content.clientXY];
			this.content.startXY = parseInt(this.$currentView.css(this.content.css));
			this.content.startXY = (isNaN(this.content.startXY)) ? 0 : this.content.startXY;
			this.content.minMouseXY = this.content.eXY-this.content.startXY+this.content.minXY;
			this.content.maxMouseXY = this.content.minMouseXY+this.content.maxXY-this.content.minXY;
			this.content.acc = this.content.startXY;
			this.content.startTs = Date.now();
		},
		
		//Content touch move return
		contentTouchMoveReturn:function() {
			this.$currentView.css(this.content.css, this.content.pre+this.content.px);
			this.$prevView.css(this.content.css, this.content.pre+this.content.prevViewWH+this.content.px);
			this.$nextView.css(this.content.css, this.content.pre+this.content.nextViewWH+this.content.px);
			this.setContentIsAnim(false, "resume");
		},
		
		//Content touch dir
		contentTouchDir:function(e, anim) {
			var xy = (Math.abs(e.pageX-this.content.eX)-Math.abs(e.pageY-this.content.eY))-(anim ? -5 : 5);
			if (xy>5) {
				return "x";
			} else if (xy<-5) {
				return "y";
			}
		},
		
		//Content touch move
		contentTouchMove:function(e) {
			if (this.content.dirBlock) {
				return;
			}
			
			var te = e.originalEvent.touches;			
			if (te.length>1) {
				this.contentTouchEnd(e);
				return;
			} else {
				this.e = te[0];
			}
			
			if (!this.content.dirCheck) {
				var anim = (this.opt.contentAnim=="slideH") ? true : false;
				var dir = this.contentTouchDir(this.e, anim);
				if (dir=="x") {
					if (anim) {
						e.preventDefault();
					} else {
						this.content.dirBlock = true;
						this.contentTouchEnd(this.e, true);
					}
					this.content.dirCheck = true;
				} else if (dir=="y") {
					if (anim) {
						this.content.dirBlock = true;
						this.contentTouchEnd(this.e, true);
					} else {
						e.preventDefault();
					}
					this.content.dirCheck = true;
				}
				return;
			}
			
			e.preventDefault();
			
			var xy = this.content.end = this.e[this.content.clientXY];
			xy = Math.max(xy, this.content.minMouseXY);
			xy = Math.min(xy, this.content.maxMouseXY);
			this.content.lastPos = this.content.currPos;
			this.content.dist = xy-this.content.eXY;
			
			if (this.content.lastPos!=this.content.dist) {
				this.content.currPos=this.content.dist;
			}
			
			if (!this.$prevView.length) {
				if (this.content.dist>0) {
					this.contentTouchMoveReturn();
					return false;
				}
			} else if (!this.$nextView.length) {
				if (this.content.dist<0) {
					this.contentTouchMoveReturn();
					return false;
				}
			}
			
			this.content.newXY = this.content.startXY+this.content.dist;
			var prevXY = this.content.newXY+this.content.prevViewWH;
			var nextXY = this.content.newXY+this.content.nextViewWH;
			this.$currentView.css(this.content.css, this.content.pre+this.content.newXY+this.content.px);
			this.$prevView.css(this.content.css, this.content.pre+prevXY+this.content.px);
			this.$nextView.css(this.content.css, this.content.pre+nextXY+this.content.px);
			var now = Date.now();
			
			if ((now-this.content.startTs)>350) {
				this.content.startTs = now;
				this.content.acc = this.content.startXY+this.content.dist;
			}
		},
		
		//Content touch end
		contentTouchEnd:function(e, b) {
			this.$doc.unbind(this.content.moveEvent).unbind(this.content.endEvent);
			this.content.isMoving = false;
			this.content.dirBlock = false;
			this.content.dirCheck = false;
			
			if (anim) {
				return;
			}
			
			this.content.slideLength = this.$contentCont[this.content.wh]();
			var dist = Math.abs(this.content.dist);
			var endXY;
			
			if (this.val.useWebKit) {
				endXY = this.tabWebKitPosition(this.$currentView, this.content.arrPos);
			} else {
				endXY = parseInt(this.$currentView.css(this.content.css));
			}
			
			endXY = (isNaN(endXY)) ? 0 : endXY;
			
			if (!dist || !endXY) {
				this.slideContentBackRePos();
				return false;
			}
			
			var diff = Math.max(40, (Date.now())-this.content.startTs);
			var accDist = Math.abs(this.content.acc - this.content.dist);
			var speed = accDist / d;
			var subtDist = Math.abs(this.content.slideLength - c);
			var that = this;
			this.content.swipeSpeed = Math.max((subtDist)/speed, 200);
			this.content.swipeSpeed = Math.min(this.content.swipeSpeed, 600);
			this.content.swipeSpeed = (isNaN(this.content.swipeSpeed)) ? 300 : this.content.swipeSpeed;
			
			if (dist>60) {
				var tab;
				
				if (this.content.start>this.content.end) {
					if (this.content.lastPos<this.content.currPos) {
						this.slideContentBack(this.content.swipeSpeed);
						return false;
					}
					tab = this.$tab.parent("li").next("li").children("a");
				} else if (this.content.start<this.content.end) {
					if (this.content.lastPos>this.content.currPos) {
						this.slideContentBack(this.content.swipeSpeed);
						return false;
					}
					tab = this.$tab.parent("li").prev("li").children("a");
				}
				
				if (tab && tab.length) {
					this.clickTab(tab, true, this.content.swipeSpeed);
				} else {
					this.slideContentBack(200);
				}
				
				if (dist==this.content.maxXY) {
					this.setContentIsAnim(false, "resume");
					this.rePositionContentView();
				}
			} else {
				this.slideContentBack(200);
			}
			
			this.content.dist = 0;
			
			return false;
		}
		
	});
	
	$.stExtend.tabsTouch = $.stCore.initTabTouch;
	$.stExtend.contentTouch = $.stCore.initContentTouch;
	
})(jQuery);