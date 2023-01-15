// class for watch brand that includes name parameter and watches array
class WatchBrand {
  constructor(name) {
    this.name = name;
    this.watches = [];
  }

  addWatch(watchname, watchface, material) {
    this.watches.push(new Watch(watchname, watchface, material));
  }
}
// class for watch that includes the parameters watchname, watchface and material
class Watch {
  constructor(watchname, watchface, material, id) {
    this.watchname = watchname;
    this.watchface = watchface;
    this.material = material;
    this.id = id;
  }
}
// Added my API link followed by CRUD operations
class WatchService {
  static url = "https://63c0a7b899c0a15d28d9a205.mockapi.io/watches";

  static getAllWatchBrands() {
    return $.get(this.url);
  }

  static getWatchBrand(id) {
    return $.get(`${this.url}/${id}`);
  }

  static createWatchBrand(watchbrand) {
    return $.post(this.url, watchbrand);
  }

  static updateWatchBrand(watchbrand) {
    console.log("update watchbrand", watchbrand);
    return $.ajax({
      url: `${this.url}/${watchbrand.id}`,
      dataType: "json",
      data: JSON.stringify(watchbrand),
      contentType: "application/json",
      type: "PUT",
    });
  }

  static deleteWatchBrand(id) {
    return $.ajax({
      url: `${this.url}/${id}`,
      type: "DELETE",
    });
  }
}
// Document Object Model AKA DOM Class 
class DOMManager {
  static watchbrands;

  static getAllWatchBrands() {
    WatchService.getAllWatchBrands().then((watchbrands) =>
      this.render(watchbrands)
    );
  }

  static createWatchBrand(name) {
    WatchService.createWatchBrand(new WatchBrand(name))
      .then(() => WatchService.getAllWatchBrands())
      .then((watchbrands) => this.render(watchbrands));
  }

  static deleteWatchBrand(id) {
    WatchService.deleteWatchBrand(id).then(() =>
      WatchService.getAllWatchBrands().then((watches) => this.render(watches))
    );
  }

  static addWatch(id) {
    console.log("Testing my watch id", id);
    for (let watchbrand of this.watchbrands) {
      if (watchbrand.id == id) {
        // let watchId = watchbrand.watches.filter(function(watchbrand.id)) => 
        // watchbrand.id.watchname === i.length > 0

        // }
        //declares a variable to filter through each watch and if an existing id is in place it will increment by 1 until an available id is found.
        watchbrand.watches.push(
          new Watch(
            $(`#${watchbrand.id}-watch-watchname`).val(),
            $(`#${watchbrand.id}-watch-watchface`).val(),
            $(`#${watchbrand.id}-watch-material`).val()
            // watchId,
          )
        );
        WatchService.updateWatchBrand(watchbrand)
          .then(() => WatchService.getAllWatchBrands())
          .then((watchbrands) => this.render(watchbrands));
      }
    }
  }
  // deleteWatch method to delete watches within the watch brands that incudes watch name, face, material
  static deleteWatch(watchBrandId, watchId) {
    console.log("testing delete:", watchBrandId, watchId);
    for (let watchbrand of this.watchbrands) {
      if (watchbrand.id == watchBrandId) {
        for (let watch of watchbrand.watches) {
          if (watch.id == watchId) {
            watchbrand.watches.splice(watchbrand.watches.indexOf(watch, 1));
            WatchService.updateWatchBrand(watchbrand)
              .then(() => WatchService.getAllWatchBrands())
              .then((watchbrands) => this.render(watchbrands));
          }
        }
      }
    }
  }
  // render method that incoudes HTML to create the body of the cards after a brand is added and the additonal info of
  // watch name, watch face and material
  static render(watchbrands) {
    this.watchbrands = watchbrands;
    // this.watchbrands.reverse()
    $("#app").empty();
    for (let watchbrand of watchbrands) {
      console.log(watchbrand);
      $("#app").prepend(`
                <div id="${watchbrand.id}" class="card">
                    <div class="card-header">
                        <h2>${watchbrand.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteWatchBrand('${watchbrand.id}')">Delete Watch Brand</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${watchbrand.id}-watch-watchname" class="form-control" placeholder="Watch Name">
                            </div>
                            <div class="col-sm">
                                <input type="text" id="${watchbrand.id}-watch-watchface" class="form-control" placeholder="Watch Face">
                            </div>
                            <div class="col-sm">
                                <input type="text" id="${watchbrand.id}-watch-material" class="form-control" placeholder="Watch Material">
                                </div>
                            </div>
                            <button id="${watchbrand.id}-new-watch" onclick="DOMManager.addWatch('${watchbrand.id}')" class="btn btn-primary form-control">Add Watch</button>
                        </div>
                    </div>
                </div> <br>`);

      for (let watch of watchbrand.watches) {
        $(`#${watchbrand.id}`)
          .find(".card-body")
          .append(
            `<p>
                    <span id="name-${watch.id}"><strong>Watchname: </strong> ${watch.watchname}</span>
                    <span id="name-${watch.id}"><strong>Watchface: </strong> ${watch.watchface}</span>
                    <span id="name-${watch.id}"><strong>Material: </strong> ${watch.material}</span>
                    <button class="btn btn-danger" = onclick="DOMManager.deleteWatch('${watchbrand.id}', '${watch.id}')">Delete Watch</button>
                    </p>
                    `
          );
      }
    }
  }
}

// create new watch brand
$("#create-new-watchbrand").click(() => {
  DOMManager.createWatchBrand($("#new-watchbrand-name").val());
  $("#new-watchbrand-name").val("");
});

// get all watches on first render
DOMManager.getAllWatchBrands();
