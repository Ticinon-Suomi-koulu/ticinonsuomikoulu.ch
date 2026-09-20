(function () {
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	var mark = document.querySelector(".logo-mark");
	var stage = document.querySelector(".logo-stage");
	if (!mark || !stage) return;

	var MOVE_X = 5;
	var MOVE_Y = 3.5;
	var MOVE_R = 1.2;
	var SKY_TOP = 32 / 400;
	var SKY_HORIZON = 163 / 400;

	var target = { x: 0, y: 0 };
	var cur = { x: 0, y: 0 };

	window.addEventListener("pointermove", function (e) {
		var r = mark.getBoundingClientRect();
		var nx = (e.clientX - (r.left + r.width / 2)) / (r.width * 0.65);
		var ny = (e.clientY - (r.top + r.height * 0.7)) / (r.height * 0.75);
		target.x = Math.max(-1, Math.min(1, nx));
		target.y = Math.max(-1, Math.min(1, ny));
	}, { passive: true });

	var canvas = document.createElement("canvas");
	canvas.className = "logo-stars";
	canvas.setAttribute("aria-hidden", "true");
	stage.insertBefore(canvas, stage.firstChild);
	var ctx = canvas.getContext("2d");
	var dpr = 1;
	var width = 0;
	var height = 0;
	var sky = { left: 0, right: 0, top: 0, bottom: 0 };
	var meteor = null;
	var nextAt = performance.now() + 1800 + Math.random() * 2500;

	function resize() {
		var r = stage.getBoundingClientRect();
		dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
		width = Math.max(1, Math.floor(r.width));
		height = Math.max(1, Math.floor(r.height));
		canvas.width = Math.floor(width * dpr);
		canvas.height = Math.floor(height * dpr);
		canvas.style.width = width + "px";
		canvas.style.height = height + "px";
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		var cs = window.getComputedStyle(stage);
		var padX = parseFloat(cs.paddingLeft) || 0;
		var padY = parseFloat(cs.paddingTop) || 0;
		var imgW = Math.max(1, width - padX * 2);
		var imgH = Math.max(1, height - padY * 2);
		sky.left = 0;
		sky.right = width;
		sky.top = padY + imgH * SKY_TOP;
		sky.bottom = padY + imgH * SKY_HORIZON;
	}

	function spawnMeteor() {
		var fromLeft = Math.random() < 0.75;
		var y0 = sky.top + (sky.bottom - sky.top) * (0.08 + Math.random() * 0.42);
		var speed = Math.max(2.2, width * (0.012 + Math.random() * 0.008));
		var ang = fromLeft ? (0.18 + Math.random() * 0.16) : (Math.PI - 0.18 - Math.random() * 0.16);
		meteor = {
			x: fromLeft ? sky.left - 8 : sky.right + 8,
			y: y0,
			vx: Math.cos(ang) * speed,
			vy: Math.sin(ang) * speed,
			life: 0,
			ttl: Math.ceil((width + 24) / speed) + 8,
			trail: 8 + Math.random() * 5
		};
	}

	window.addEventListener("resize", resize);
	resize();

	function tick(now) {
		cur.x += (target.x - cur.x) * 0.05;
		cur.y += (target.y - cur.y) * 0.05;
		mark.style.transform =
			"translate(" + (cur.x * MOVE_X) + "px, " + (cur.y * MOVE_Y) + "px) rotate(" + (cur.x * MOVE_R) + "deg)";

		if (!meteor && now >= nextAt) spawnMeteor();

		ctx.clearRect(0, 0, width, height);
		if (meteor) {
			meteor.x += meteor.vx;
			meteor.y += meteor.vy;
			meteor.life += 1;
			var t = meteor.life / meteor.ttl;
			var alpha = t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88;
			alpha = Math.max(0, alpha) * 0.95;
			var tx = meteor.x - meteor.vx * meteor.trail;
			var ty = meteor.y - meteor.vy * meteor.trail;

			ctx.save();
			ctx.beginPath();
			ctx.rect(sky.left, sky.top, sky.right - sky.left, sky.bottom - sky.top);
			ctx.clip();

			var g = ctx.createLinearGradient(tx, ty, meteor.x, meteor.y);
			g.addColorStop(0, "rgba(155, 241, 255, 0)");
			g.addColorStop(0.55, "rgba(155, 241, 255, " + (alpha * 0.4) + ")");
			g.addColorStop(1, "rgba(255, 255, 255, " + alpha + ")");
			ctx.strokeStyle = g;
			ctx.lineWidth = 1.35;
			ctx.lineCap = "round";
			ctx.beginPath();
			ctx.moveTo(tx, ty);
			ctx.lineTo(meteor.x, meteor.y);
			ctx.stroke();
			ctx.fillStyle = "rgba(255, 255, 255, " + alpha + ")";
			ctx.beginPath();
			ctx.arc(meteor.x, meteor.y, 1.5, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();

			if (
				meteor.life >= meteor.ttl ||
				meteor.x < sky.left - 20 ||
				meteor.x > sky.right + 20 ||
				meteor.y > sky.bottom + 8
			) {
				meteor = null;
				nextAt = now + 11000 + Math.random() * 18000;
			}
		}

		requestAnimationFrame(tick);
	}

	requestAnimationFrame(tick);
})();
