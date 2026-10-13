/* A room's filter lives in ?filter= (app/components/room/reader-list.tsx). It goes on <html> before the first paint, so a
   filtered list is drawn filtered from the start and stays still when moving between entries. reader.tsx renders the
   rules that read it; a value the room doesn't have matches none of them. */
(function () {
  if (typeof window === "undefined") return;
  var filter = new URLSearchParams(location.search).get("filter");
  if (filter && /^[a-z]+$/.test(filter)) document.documentElement.setAttribute("data-filter", filter);
})();
