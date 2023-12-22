const searchBar = document.getElementById("search_query");
      const searchResults = document.getElementById("search_results");

      function debounce(func, timeout = 1000) {
        let timer;
        return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => {
            func.apply(this, args);
          }, timeout);
        };
      }

      async function search(q) {
        const data = await fetch(
          "https://stock-search-x5qjjeqxja-uc.a.run.app/?ticker=" + q,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let jsonData = await data.json();

        if (jsonData.length !== 0) {
          jsonData.forEach((x) => {
            let link = document.createElement("a");
            link.setAttribute("href", "/insider/" + x.symbol.toLowerCase());
            link.innerText = x.name + " (" + x.symbol + ")";

            let listItem = document.createElement("li");
            listItem.setAttribute("class", "list-group-item");
            listItem.appendChild(link);
            searchResults.appendChild(listItem);
          });
        } else {
          searchResults.innerText = "No results";
        }
      }

      const processChange = debounce(() => {
        if (searchBar.value == "") {
          searchResults.innerHTML = "";
        } else {
          if (searchResults.innerText !== "") {
            searchResults.innerHTML = "";
            search(searchBar.value);
          } else {
            search(searchBar.value);
          }
        }
      });

      searchBar.addEventListener("keyup", processChange);