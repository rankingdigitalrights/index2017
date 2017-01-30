<% if (label) { %>
<label class="blocklabel"><%= label %></label>
<% } %>
<% if (categoryTitle) { %>
  <h2 class="spaced-row"><a href="<%= baseurl %>/categories/<%= categoryTitle.src %>"><%= categoryTitle.display %></a></h2>
<% } %>
<h3>
  <a href="<%= baseurl %>/indicators/<%= indicator %>"><%= name %></a>
</h3>
<h4 class="displaytext"><%- text %></h4>
<div class="bar--container"></div>
