import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const BuyMeCoffee = buildModule("BuyMeCoffee", (m) => {
    const contract = m.contract("BuyMeCoffee");
    return {contract};
})

module.exports = BuyMeCoffee;