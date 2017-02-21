<div class="col-6 container--left">
	<% indicators_left.forEach(function (i) { %>
	<h5 class="survey--question_hed">
	  <a href="<%= i.baseurl %>/indicators/<%= i.indicator %>"><%= i.name %></a>
	</h5>

	<% i.text.forEach(function (t) { %>
	  <p class="indicator--sub_text"><%= t %></p>
	<% }); %>

	<% }); %>
</div> <!-- left column -->

<div class="col-6 container--right">
	<% indicators_right.forEach(function (i) { %>
	<h5 class="survey--question_hed">
	  <a href="<%= i.baseurl %>/indicators/<%= i.indicator %>"><%= i.name %></a>
	</h5>

	<% i.text.forEach(function (t) { %>
	  <p class="indicator--sub_text"><%= t %></p>
	<% }); %>

<% }); %>
</div> <!-- right column -->
