$(document).ready(function () {
  const saveOutfitsBtn = $(".save-outfits");
  const clearClothesBtn = $(".clear-clothes");
  const viewOutfitsBtn = $(".view-all-outfits");



  function loadLocal(type) {
    let response = JSON.parse(localStorage.getItem(type));
    // console.log(response);
    if (response !== null) {
      let garmentType = response.type;
      //   console.log(response.type);
      $(`#${garmentType}-box`).empty();
      let garmentInfo = $("<h3>")
        .attr("data-id", `${response.id}`)
        .text(response.name);
      $(`#${garmentType}-box`).append(garmentInfo);
    }
  }


  loadLocal("Shirt");
  loadLocal("Hats");
  loadLocal("Pants");
  loadLocal("Shoes");
  loadLocal("Outerwear");

  // listening to the icons to show garments
  const btn = $(".garment-view").on("click", function () {
    const type = $(this).data("name");
    console.log(type);

    $.get("/garments/" + type, (data) => {
      console.log("hello");
      if (type == undefined) {
        window.location.href = "/closets/";
      } else {
        window.location.href = "/garments/" + type;
      }
    });
  });

  // listening to the add icon
  $(".plus").on("click", function () {
    const id = $(this).data("id");
    const name = $(this).data("name");

    $.ajax({
      url: "/api/garments/" + id,
      method: "GET",
    }).then((response) => {
      console.log(response);
      fillBox(response);
    });

    function fillBox(response) {
      console.log(response.type);
      console.log(response.name);
      let garmentType = response.type;
      $(`#${garmentType}-box`).empty();
      let garmentInfo = $("<h3>")
        .attr("data-id", `${response.id}`)
        .text(response.name);
      $(`#${garmentType}-box`).append(garmentInfo);
      // let savedItems = {"itemName":response.name, "itemID":response.id}
      localStorage.setItem(garmentType, JSON.stringify(response));
    }
  });

  /**
   * Listening to the delete icon.
   * Deleting the garment based on the id
   */
  $(".trash").on("click", function () {
    const id = $(this).data("id");
    const type = $(this).data("type");
    let currentSpot = JSON.parse(localStorage.getItem(type))
    console.log(JSON.parse(localStorage.getItem(type)))
    $.ajax("/api/garments/" + id, {
      type: "DELETE",
    }).then(function () {
      console.log("Garment deleted");
      if (currentSpot.id === id) {
        localStorage.removeItem(type);
        location.reload();
      }
      // Reload the page to get the updated list
      location.reload();
    });
  });
  //   * Listening to the edit icon.
  //   * Redirecting to the edit garment page based on the id
  //   */
  $(".edit").on("click", function () {
    const id = $(this).data("id");
    location.href = "/garments/" + id + "/edit";
  });


  // listening to the save button to save the outfit to the database.
  saveOutfitsBtn.on("click", () => {
    const outfitName = $(".outfit-name").val().trim();

    // create a new outfit to be sent with the post request
    const newOutfit = {
      name: outfitName,
      hat_id: JSON.parse(localStorage.getItem("Hats")) ? JSON.parse(localStorage.getItem("Hats")).id : null,
      shirt_id: JSON.parse(localStorage.getItem("Shirt")) ? JSON.parse(localStorage.getItem("Shirt")).id : null,
      pant_id: JSON.parse(localStorage.getItem("Pants")) ? JSON.parse(localStorage.getItem("Pants")).id : null,
      shoe_id: JSON.parse(localStorage.getItem("Shoes")) ? JSON.parse(localStorage.getItem("Shoes")).id : null,
      outer_id: JSON.parse(localStorage.getItem("Outerwear")) ? JSON.parse(localStorage.getItem("Outerwear")).id : null
    };

    // sending the post request to create a new outfit
    $.ajax("/api/outfits", {
      method: "POST",
      data: newOutfit
    }).then((response) => {

      alert(response)
    })

  })


  // redirect the page
  viewOutfitsBtn.on("click", () => {
    window.location.href = "/outfits";
  });

  // clear the outfits
  clearClothesBtn.on("click", () => {
    localStorage.clear();
    location.reload();
  })

  // end of document ready function
});


