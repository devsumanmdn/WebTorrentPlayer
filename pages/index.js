import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { mergeClasses } from "@material-ui/styles";

import dynamic from "next/dynamic";

const WebTorrent = dynamic(() => import("webtorrent/webtorrent.min"), {
  ssr: false
});

const magnetURL = require("magnet-uri");

let client;

const styles = {
  root: {
    display: "flex",
    alignItems: "center"
  }
};

const getTorrent = (magnet, fn) => {
  let decoded = magnetURL(magnet);
  for (let torrent of client.torrents) {
    if (torrent.infoHash === decoded.infoHash) {
      // TODO: make sure all trackers and web seeds are added
      return fn(torrent);
    }
  }
  client.add(magnet, fn);
};

function index({ classes }) {
  const [magnetURI, setMagnetURI] = useState("");

  const [files, setFiles] = useState(null);

  useEffect(() => {
    client = new WebTorrent();
  }, []);

  const getFiles = () => {
    getTorrent(magnetURI, torrent => {
      console.log(torrent);
      // torrent.files.forEach(file => {
      //   if (this._file) {
      //     if (file.name === this._file || file.path === this._file) {
      //       file.appendTo(this);
      //     }
      //   } else {
      //     file.appendTo(this);
      //   }
      // });
    });
  };

  return (
    <form className={classes.root}>
      <TextField
        margin={"dense"}
        variant={"outlined"}
        label={"Magnet URL"}
        placeholder={"magnet:"}
        value={magnetURI}
        onChange={({ target }) => setMagnetURI(target.value)}
      />
      <Button onClick={getFiles}>Go</Button>
    </form>
  );
}

index.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(index);
