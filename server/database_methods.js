const nedb = require('nedb')

let db = new nedb({ // kolekcja 
    filename: 'playlist/db.db',
    autoload: true
});


module.exports = class DatabaseMethods {

    static async getPlaylist() {
        console.log("getPlaylist()")
        return new Promise((resolve, reject) => {
            // console.log(this.session_id)
            db.find({}, function (err, docs) {
                // w docsach jest cała playlista
                resolve(docs)
            })
        })
    }

    static async addToPlaylist(album, title) {
        console.log("addToPlaylist()")
        let new_song = {
            // _id: automatycznie ustawiane
            album: album,
            title: title,
        }
        return new Promise((resolve, reject) => {
            db.find({ title: title }, function (err, docs) {
                if (docs.length == 0) { // nie ma jeszcze dodanej takiej playlisty
                    db.insert(new_song, function (err, newDoc) { //dodawanie wykonuje się chyba asynchronicznie patrząc po milisekundach
                        resolve(newDoc._id)
                    })
                } else {
                    resolve(false)
                }
            })
        })
    }

    static async removeFromPlaylist(id) {
        console.log("removeFromPlaylist()")
    }
}