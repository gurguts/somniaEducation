import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BuyMeCoffee = buildModule("Greeter", (m) => {
    const contract = m.contract("Greeter", ["testNickName"]);
    return { contract };
});

module.exports = BuyMeCoffee;