<% if (label) { %>
<label><%= label %></label>
<% } %>
<% if (categoryTitle) { %>
  <h2 class="page--subtitle">
  	<%= categoryTitle.display %>  
  	<!--
  	<a href="<%= baseurl %>/categories/<%= categoryTitle.src %>">
  		<%= categoryTitle.display %>  
		</a>
		-->
  </h2>
<% } %>
<h3>
	<%= name %>
  <!--<a href="<%= baseurl %>/indicators/<%= indicator %>"><%= name %></a>-->
</h3>
<p><%- text %></p>
<div class="bar--container"></div>