export default ({content, appState})=> {
    return (`<html>
        <head>
            <title>Searchkit</title>
            <link rel="stylesheet" type="text/css" href="public/search-styles.css" />
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <script type="text/javascript">
               window.__INITIAL_APP_STATE__ = ${JSON.stringify(appState)}
            </script>
        </head>
        <body>
            <div id="searchApp">${content}</div>
            <script type="text/javascript" src="public/client.js"></script>
        </body>
    </html>`)
}
