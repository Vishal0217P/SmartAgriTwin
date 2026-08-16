// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;


contract SkillCredential {

    struct Credential {

        string farmerName;

        string skill;

        string credentialId;

        uint256 issuedAt;

        bool valid;

    }


    mapping(string => Credential)
        public credentials;


    function issueCredential(

        string memory _farmerName,

        string memory _skill,

        string memory _credentialId

    ) public {

        credentials[_credentialId] =
            Credential({

                farmerName: _farmerName,

                skill: _skill,

                credentialId: _credentialId,

                issuedAt: block.timestamp,

                valid: true

            });

    }


    function verifyCredential(

        string memory _credentialId

    )
        public
        view
        returns (
            string memory,
            string memory,
            bool
        )
    {

        Credential memory credential =
            credentials[_credentialId];

        return (

            credential.farmerName,

            credential.skill,

            credential.valid

        );

    }

}