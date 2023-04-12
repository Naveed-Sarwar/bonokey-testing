import filestream from "filereader-stream";
import csv from "csv-parser";

const CSVReader = async (file, delimiter) => {
  return new Promise((resolve) => {
    const results = [];
    filestream(file)
      .pipe(csv({ separator: delimiter }))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results));
  });
};

export default CSVReader;
