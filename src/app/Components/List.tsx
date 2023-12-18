import { LocksmithService } from "@unlock-protocol/unlock-js";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";

// TODO: paginate!
const getList = async (token: string, page: number, setList) => {
  const service = new LocksmithService();
  const { data: keys } = await service.keys(
    137,
    "0xbcc2533501bef44c2c050df0419c85ce30f928cb",
    "",
    "owner",
    undefined,
    0,
    30,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  setList(keys);
};

export const List = ({ token }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    getList(token, 0, setList);
  }, [token]);

  return (
    <table className="border-separate [border-spacing:0.75rem]">
      <thead>
        <tr>
          <th>TokenId</th>
          <th>Owner</th>
          {Array.from({ length: 9 }).map((_, i) => {
            return <th key={i}>hudl_{i}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {list.map((item, i) => {
          return <Row token={token} key={i} item={item} />;
        })}
      </tbody>
    </table>
  );
};

export const Row = ({ item, token }) => {
  return (
    <tr>
      <td>{item.token}</td>
      <td>{item.keyholderAddress}</td>
      {Array.from({ length: 9 }).map((_, i) => {
        return <Cell attribute={i} key={i} item={item} token={token} />;
      })}
    </tr>
  );
};

export const Cell = ({ item, attribute, token }) => {
  const [value, setValue] = useState(item[`hudl_${attribute}`]);
  const toggle = useCallback(() => {
    const service = new LocksmithService();
    service.updateUserMetadata(
      137,
      "0xbcc2533501bef44c2c050df0419c85ce30f928cb",
      item.keyholderAddress,
      {
        metadata: {
          public: {
            [`hudl_${attribute}`]: !value,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setValue(!value);
  }, [value]);

  return (
    <td className="text-center">
      <input type="checkbox" checked={value} onClick={() => toggle()}></input>
    </td>
  );
};