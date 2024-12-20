<?php
	function consolelog($data) {
		echo <<< EOS
			<script>console.log("$data");</script>
		EOS;
	}
	session_start();
	// consolelog(session_id());

	$token = bin2hex(openssl_random_pseudo_bytes(16));
	$_SESSION["token"] = $token;
	$_SESSION["GAME_COUNT"] = -1;
	// $_SESSION["registered"] = false;
	// consolelog($_SESSION["token"]);
?>

<!DOCTYPE html>
<html lang="ja">

	<head prefix="og: https://ogp.me/ns#">
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

		<!-- OGP -->
		<meta property="og:site_name" content="syntck.com">
		<meta property="og:title" content="台パンリバーシ3D">
		<meta property="og:description" content="台パンで不利な局面と石をひっくり返せ！">
		<meta property="og:url" content="reversi.syntck.com">
		<meta property="og:type" content="game">
		<meta property="og:image" content="img/ogp_image.png">
		<meta property="og:twitter:card" content="summary">
		<meta property="og:twitter:site" content="@Tomo_1151">
		<meta property="og:twitter:domain" content="reversi.syntck.com">
		<meta property="og:twitter:image" content="img/ogp_image.png">


		<title>台パンリバーシ3D</title>

		<!-- ICON Load -->
		<link rel="apple-touch-icon" type="image/vnd.microsoft.icon" href="favicon.ico">
		<link rel="icon" type="image/vnd.microsoft.icon" href="img/favicon.ico">

		<!-- CSS Load -->
		<link rel="stylesheet" type="text/css" href="css/style.css">

		<!-- JS Load -->
		<script type="importmap">
			{
				"imports": {
					"three": "./lib/three.js/build/three.module.js",
					"three/addons/": "./lib/three.js/jsm/"
				}
			}
		</script>
		<script>
			document.addEventListener('touchmove', function (event) {
				if (event.scale !== 1) {
					event.preventDefault();
				}
			}, { passive: false });
		</script>
		<script defer type="module" src="js/Main.js"></script>
	</head>

	<body>
		<div class="caution" id="caution_screen">
			<p>スマホを横向きにしてください</p>
			<div class="phone_image">
				<img src="img/phone_rotation.png" alt="">
			</div>
		</div>

		<div id="loading_screen">
			<p>ロード中</p>
			<div class="loading-image">
				<img src="img/loading.gif">
			</div>
			<progress value="0" max="100" id="disk_progress"></progress>
			<progress value="0" max="100" id="board_progress"></progress>
		</div>

		<div id="log">
			<h2>─ Log message ─</h2>
		</div>

		<div id="ingame_ui">
			<div class="buttons-wrapper" id="action_button">
<!-- 				<div class="button disabled" id="put_button">
					<p>おく</p>
				</div> -->
				<div class="button disabled" id="pass_button">
					<p>パス</p>
				</div>
				<div class="button disabled" id="bang_button" style="display: none;">
					<p>台パン</p>
				</div>
			</div>
			<div class="order" id="order_div">
				<p id="order" class="order-black"><span>黒</span></p>
				<p>の手番です</p>
			</div>
			<div class="meter" id="meter">
				<hr id="boiling_point">
				<img src="img/steam.gif" class="steam-left" id="steam_left" style="display: none;">
				<img src="img/steam.gif" class="steam-right" id="steam_right" style="display: none;">
				<span class="meter-name">frustration meter</span>
				<div id="meter_value"></div>
			</div>
		</div>

		<div class="cut" id="cut" style="display: none;">
			<p>ゲームスタート</p>
		</div>

		<div class="fadeIn" id="title_screen">
			<h1 style="margin-bottom: 1rem;">台パンリバーシ<sup>3D</sup></h1>
			<div>
				<input type="text" id="player_name" placeholder="プレイヤー名を入力してください" maxlength="15">
				<p class="annotation">プレイヤー名はランキングに使用します<br>プレイヤー名が<wbr>空の場合は<wbr>ランキングに登録<wbr>されません</p>
			</div>
			<div class="settings">
				<input type="checkbox" name="mode" id="game_mode">
				<label for="game_mode" id="hotheaded">短気モード</label>
			</div>
			<div class="button" id="start_button">
				<p>はじめる</p>
			</div>
		</div>

		<div class="fadeIn" id="result_screen">
			<h2>Result</h2>
			<h3 id="winner"></h3>
			<div id="result">
				<p id="score"></p>
				<div class="order-count">
					<p>[black]</p>
					<p id="order_black_name"></p>
					<p id="order_black"></p>
				</div>
				<div class="order-count">
					<p>[white]</p>
					<p id="order_white_name"></p>
					<p id="order_white"></p>
				</div>

				<p id="time"></p>
			</div>
			<div class="result-buttons">
				<div class="button" id="restart_button">
					<p>タイトルに戻る</p>
				</div>
				<div class="button">
					<p><img src="img/twitter_logo.png" class="twitter">Twitterで結果を共有する！</p>
					<a href="" rel="nofollow noopener noreferrer" target="_blank" id="share_button"></a>
				</div>
			</div>
		</div>

		<canvas id="main-canvas"></canvas>
		<input type="hidden" name="token" value="<?php echo $_SESSION['token']?>" id="token">
	</body>

</html>