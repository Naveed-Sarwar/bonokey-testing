import React from "react";
import Cookies from "cookies";
import { GetServerSideProps } from "next";
import CSVReader from "../../controller/CSVReader";
import { verify } from "../../controller/Auth";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);

  const token = cookies?.get("token");
  if ((await verify(token)) == null)
    return {
      redirect: {
        permanent: false,
        destination: "/admin/login",
      },
    };

  return {
    props: {
      token,
    },
  };
};

class Admin extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      delimiter: ",",
      banks: null,
      sectors: null,
      salaries: null,
      saleReps: null,
      apr: null,
    };

    this.import = this.import.bind(this);
  }

  async import(e) {
    e.preventDefault();
    const { token } = this.props;
    const { delimiter, banks, sectors, salaries, saleReps, apr } = this.state;

    if (
      delimiter === "" ||
      !banks ||
      !sectors ||
      !salaries ||
      !saleReps ||
      !apr
    )
      return alert("Please add all the necessary files and inputs!");

    const banksFile = await CSVReader(banks, delimiter);
    const sectorsFile = await CSVReader(sectors, delimiter);
    const salariesFile = await CSVReader(salaries, delimiter);
    const saleRepsFile = await CSVReader(saleReps, delimiter);
    const aprFile = await CSVReader(apr, delimiter);

    const res = await fetch("/api/import", {
      method: "POST",
      body: JSON.stringify({
        token,
        banks: banksFile,
        sectors: sectorsFile,
        salaries: salariesFile,
        saleReps: saleRepsFile,
        apr: aprFile,
      }),
    }).then((res) => res.json());

    if (res?.error) alert(res.error);
    else alert("Imported successfully!");
  }

  render() {
    return (
      <div>
        <h1>Admin</h1>
        <p>
          Caution: Please import a complete data pack! It will drop the database
          and create a new one!
        </p>

        <form onSubmit={this.import}>
          <label htmlFor="delimiter">Delimiter in csv files:</label>
          <br />
          <input
            type="text"
            id="delimiter"
            value={this.state.delimiter}
            onChange={(e) => this.setState({ delimiter: e.target.value })}
          />

          <br />
          <br />

          <label htmlFor="banks">Banks import file:</label>
          <br />
          <input
            type="file"
            id="banks"
            accept=".csv"
            onChange={(e) => this.setState({ banks: e.target.files[0] })}
          />

          <br />
          <br />

          <label htmlFor="sectors">Sectors import file:</label>
          <br />
          <input
            type="file"
            id="sectors"
            accept=".csv"
            onChange={(e) => this.setState({ sectors: e.target.files[0] })}
          />

          <br />
          <br />

          <label htmlFor="salaries">Salaries import file:</label>
          <br />
          <input
            type="file"
            id="salaries"
            accept=".csv"
            onChange={(e) => this.setState({ salaries: e.target.files[0] })}
          />

          <br />
          <br />

          <label htmlFor="saleReps">SaleReps import file:</label>
          <br />
          <input
            type="file"
            id="saleReps"
            accept=".csv"
            onChange={(e) => this.setState({ saleReps: e.target.files[0] })}
          />

          <br />
          <br />

          <label htmlFor="apr">APR import file:</label>
          <br />
          <input
            type="file"
            id="apr"
            accept=".csv"
            onChange={(e) => this.setState({ apr: e.target.files[0] })}
          />

          <br />
          <br />

          <button type="submit">Import</button>
        </form>
      </div>
    );
  }
}

export default Admin;
