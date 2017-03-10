<div class="title-section">
  <div class="overall-score">
    <label>Service</label>
    <div class="overall-score-value"><%= service %></div>
  </div>
  <div class="overall-score">
    <label>Compnay</label>
    <div class="overall-score-value"><%= company %></div>
  </div>
</div>


<div class="container--left">        
  <p><%= text %></p>
</div>

<div class="container--right">
  <div class="comp--industry">
    <label>Score within the service: </label>
    <p><%= rank %> </p>
    <p><%= total  %>  </p>
  </div>
  <div class="comp--mark">
    <label>Position among other services</label>
    <div id="<%= rank %>-dot-chart"> </div>
  </div>
</div>