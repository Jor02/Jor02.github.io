var grid = document.getElementById("grid");
var template = document.getElementById("maptemplate");

fetch(
  "https://opensheet.elk.sh/1qcQfUBKkgwpQnt0fAQmPUsRS3xuBP0WkmazVXDoL6IY/Detailed+Map+List"
)
  .then((res) => res.json())
  .then((data) =>
    data.forEach((row) => {
      var tile = CreateTile(row);
      if (tile != null) grid.appendChild(tile);
    })
  );

function CreateTile(row) {
  if (isNullOrEmpty(row["Map Name"])) return null; // Return if no data

  if ("content" in document.createElement("template")) {
    //Clone Template
    var node = template.content.children[0].cloneNode(true);

    //Video
    if (!isNullOrEmpty(row["Video"]))
      node.children[0].children[0].innerHTML = getYoutubeEmbed(row["Video"]);

    //Get Body
    var cardbody = node.children[0].children[1];
    cardbody.children[0].children[0].textContent = escapeHtml(row["Map Name"]); // Title
    cardbody.children[0].children[0].href = row["Download"];
    cardbody.children[0].children[1].textContent = !isNullOrEmpty(row["Author"]) ? "By " + escapeHtml(row["Author"]) : ""; // Author
    if (!isNullOrEmpty(row["Comments / Notes"])) cardbody.children[1].textContent = escapeHtml(row["Comments / Notes"]);
    return node;
  } else {
    var node = document.createElement("p");
    node.appendChild(document.createTextNode(row["Map Name"]));
    return node;
  }
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function isNullOrEmpty(str) {
  return str === null || str === undefined || /^\s*$/.test(str);
}

function getYoutubeEmbed(url) {
  const videoId = getId(url);
  const iframeMarkup =
    '<iframe height="227" src="//www.youtube.com/embed/' +
    videoId +
    '" frameborder="0" allowfullscreen></iframe>';

    const placeholder = document.createElement("div");
    placeholder.innerHTML = iframeMarkup;

    return iframeMarkup;
}

function getId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}