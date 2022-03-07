var grid = document.getElementById("grid");
var template = document.getElementById("maptemplate");

fetch(
  "https://opensheet.elk.sh/11bmvaGVkJtoERDa9Caobigt3s7EsLEpEFqaVB2Gb2Xk/map_data"
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
  const video = parseURL(url);
  const iframeMarkup = `<iframe 
      height="227"
      srcdoc="<link rel='stylesheet' href='./video.css'/><a href=https://www.youtube.com/embed/${video.id}?autoplay=1&start=${video.time == null ? 0 : video.time}><img src=https://img.youtube.com/vi/${video.id}/hqdefault.jpg alt='video'><span>▶</span></a>"
      frameborder="0"
      allowfullscreen
      loading="lazy">
    </iframe>`;

    const placeholder = document.createElement("div");
    placeholder.innerHTML = iframeMarkup;
    return iframeMarkup;
}

function parseURL(url) {
  //const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const regExp =
    /^.*?(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)(?:(\?t|\?start|\&t|\&start)=(\d+))?.*/;
  const match = url.match(regExp);
  return {
    id: match && match[2].length === 11 ? match[2] : null,
    time: match && match[4] 
  };
}

function getTimestamp(url) {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?.*t=|&t=|time=|&time=)([\d]*).*/;
  const match = url.match(regExp);

  return match && match[2];
}