<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/style.css">
    <title>Orbital</title>
</head>

<body>

    <div id="root">
        <header>
            <h1>Orbital</h1>
            <div class="btn-group">
                <button id="display-grid">Grille</button>
                <button>Button 2</button>
                <button>Button 3</button>
            </div>
        </header>
        <main>
            <div id="view"></div>
        </main>
        <footer>
            <p>Jérôme Pourra - Orbital - <?= date("Y") ?></p>
        </footer>
    </div>

    <script type="module" src="./js/main.js"></script>

</body>

</html>