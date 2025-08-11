// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecords {

    struct Patient {
        string name;
        uint8 age;
        string phoneNumber;
        string homeAddress;
        string prescription;  // Plain text prescription
        string medicalTestResults;  // Plain text test results
        string medicalConditions;  // Plain text medical conditions
        bytes32 prescriptionHash;  // Hashed version of prescription
        bytes32 medicalTestResultsHash;  // Hashed version of test results
        bytes32 medicalConditionsHash;  // Hashed version of conditions
    }

    // List to store patient addresses
    address[] private patientAddresses;
    mapping(address => Patient) private patients;
    address private owner;
    
    event PatientAdded(address indexed patientAddress);
    event PatientUpdated(address indexed patientAddress);
    event PrescriptionUpdated(address indexed patientAddress);
    event MedicalTestResultsUpdated(address indexed patientAddress);
    event MedicalConditionsUpdated(address indexed patientAddress);
    
    // modifier onlyOwner() {
    //     require(msg.sender == owner, "Only owner can perform this action.");
    //     _;
    // }

    constructor() {
        owner = msg.sender;
    }
    
    function hashData(string memory data) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(data));
    }

    function addPatient(
        address _patientAddress, 
        string memory _name,
        uint8 _age, 
        string memory _phoneNumber, 
        string memory _homeAddress, 
        string memory _prescription, 
        string memory _medicalTestResults, 
        string memory _medicalConditions
    ) public {
        // Check if the patient already exists
        require(bytes(patients[_patientAddress].name).length == 0, "Patient already exists");
    
        bytes32 prescriptionHash = hashData(_prescription);
        bytes32 medicalTestResultsHash = hashData(_medicalTestResults);
        bytes32 medicalConditionsHash = hashData(_medicalConditions);
        
        patients[_patientAddress] = Patient(
            _name,
            _age, 
            _phoneNumber, 
            _homeAddress, 
            _prescription, 
            _medicalTestResults, 
            _medicalConditions,
            prescriptionHash, 
            medicalTestResultsHash, 
            medicalConditionsHash
        );
        
        // Add the patient address to the array
        patientAddresses.push(_patientAddress);
        emit PatientAdded(_patientAddress);
    }
    // Function to get all registered patient addresses
    function getAllPatientAddresses() public view returns (address[] memory) {
        return patientAddresses;
    }
    
    function updatePatient(
        address _patientAddress, 
        string memory _name,
        uint8 _age, 
        string memory _phoneNumber, 
        string memory _homeAddress, 
        string memory _prescription, 
        string memory _medicalTestResults, 
        string memory _medicalConditions
    ) public {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        
        bytes32 prescriptionHash = hashData(_prescription);
        bytes32 medicalTestResultsHash = hashData(_medicalTestResults);
        bytes32 medicalConditionsHash = hashData(_medicalConditions);
        
        patients[_patientAddress] = Patient(
            _name,
            _age, 
            _phoneNumber, 
            _homeAddress, 
            _prescription, 
            _medicalTestResults, 
            _medicalConditions,
            prescriptionHash, 
            medicalTestResultsHash, 
            medicalConditionsHash
        );
        
        emit PatientUpdated(_patientAddress);
    }
    
    function updatePrescription(
        address _patientAddress, 
        string memory _prescription
    ) public {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        
        bytes32 prescriptionHash = hashData(_prescription);
        
        patients[_patientAddress] = Patient(
            patients[_patientAddress].name,
            patients[_patientAddress].age,
            patients[_patientAddress].phoneNumber,
            patients[_patientAddress].homeAddress,
            _prescription,
            patients[_patientAddress].medicalTestResults,
            patients[_patientAddress].medicalConditions,
            prescriptionHash,
            patients[_patientAddress].medicalTestResultsHash,
            patients[_patientAddress].medicalConditionsHash
        );
        
        emit PrescriptionUpdated(_patientAddress);
    }
    
    function updateMedicalTestResults(
        address _patientAddress, 
        string memory _medicalTestResults
    ) public {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        
        bytes32 medicalTestResultsHash = hashData(_medicalTestResults);
        
        patients[_patientAddress] = Patient(
            patients[_patientAddress].name,
            patients[_patientAddress].age,
            patients[_patientAddress].phoneNumber,
            patients[_patientAddress].homeAddress,
            patients[_patientAddress].prescription,
            _medicalTestResults,
            patients[_patientAddress].medicalConditions,
            patients[_patientAddress].prescriptionHash,
            medicalTestResultsHash,
            patients[_patientAddress].medicalConditionsHash
        );
        
        emit MedicalTestResultsUpdated(_patientAddress);
    }

    function updateReport(
        address _patientAddress,
        string memory _prescription,
        string memory _medicalTestResults
    ) public {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        bytes32 prescriptionHash = hashData(_prescription);
        bytes32 medicalTestResultsHash = hashData(_medicalTestResults);
        
        patients[_patientAddress] = Patient(
            patients[_patientAddress].name,
            patients[_patientAddress].age,
            patients[_patientAddress].phoneNumber,
            patients[_patientAddress].homeAddress,
            _prescription,
            _medicalTestResults,
            patients[_patientAddress].medicalConditions,
            prescriptionHash,
            medicalTestResultsHash,
            patients[_patientAddress].medicalConditionsHash
        );
        
        emit MedicalTestResultsUpdated(_patientAddress);
    }
    
    function updateMedicalConditions(
        address _patientAddress, 
        string memory _medicalConditions
    ) public {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        
        bytes32 medicalConditionsHash = hashData(_medicalConditions);
        
        patients[_patientAddress] = Patient(
            patients[_patientAddress].name,
            patients[_patientAddress].age,
            patients[_patientAddress].phoneNumber,
            patients[_patientAddress].homeAddress,
            patients[_patientAddress].prescription,
            patients[_patientAddress].medicalTestResults,
            _medicalConditions,
            patients[_patientAddress].prescriptionHash,
            patients[_patientAddress].medicalTestResultsHash,
            medicalConditionsHash
        );
        
        emit MedicalConditionsUpdated(_patientAddress);
    }
    
    function getPatientDetails(address _patientAddress) public view returns (string memory, uint8, string memory, string memory, string memory, string memory, string memory) {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        return (
            patients[_patientAddress].name,
            patients[_patientAddress].age,
            patients[_patientAddress].phoneNumber,
            patients[_patientAddress].homeAddress,
            patients[_patientAddress].prescription,
            patients[_patientAddress].medicalTestResults,
            patients[_patientAddress].medicalConditions
            );
    }

    function getPName(address _patientAddress) public view returns (string memory) {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        return (
            patients[_patientAddress].name
            );
    }

    function getPAge(address _patientAddress) public view returns (uint8) {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        return (
            patients[_patientAddress].age
            );
    }

    function getPPhoneNumber(address _patientAddress) public view returns (string memory) {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        return (
            patients[_patientAddress].phoneNumber
            );
    }

    function getPHomeAddress(address _patientAddress) public view returns (string memory) {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        return (
            patients[_patientAddress].homeAddress
            );
    }

    function getPPrescription(address _patientAddress) public view returns (string memory) {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        return (
            patients[_patientAddress].prescription
            );
    }

    function getPMedicalTestResults(address _patientAddress) public view returns (string memory) {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        return (
            patients[_patientAddress].medicalTestResults
            );
    }

    function getPMedicalConditions(address _patientAddress) public view returns (string memory) {
        require(bytes(patients[_patientAddress].phoneNumber).length != 0, "Patient does not exist.");
        return (
            patients[_patientAddress].medicalConditions
            );
    }
    
    function verifyData(address _patientAddress, string memory _prescription, string memory _medicalTestResults, string memory _medicalConditions) 
        public view returns (bool prescriptionMatch, bool medicalTestResultsMatch, bool medicalConditionsMatch) {
        
        Patient memory patient = patients[_patientAddress];
        
        prescriptionMatch = (hashData(_prescription) == patient.prescriptionHash);
        medicalTestResultsMatch = (hashData(_medicalTestResults) == patient.medicalTestResultsHash);
        medicalConditionsMatch = (hashData(_medicalConditions) == patient.medicalConditionsHash);
    }
}

contract PatientProxyFactory {
    address public owner;
    bytes data;
    address[] public allProxyAddresses;  // Array to store all created proxy addresses

    event PatientProxyCreated(address indexed proxyAddress, string indexed patientPhoneNumber);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can create proxy addresses.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function operateAddPatient(
        address payable proxyAddress,  // Change to payable address
        address patientRecordsContract,
        address patientAddress,
        string memory name,
        uint8 age,
        string memory phoneNumber,
        string memory homeAddress,
        string memory prescription,
        string memory medicalTestResults,
        string memory medicalConditions
    ) public {
        // Prepare the encoded data for the `addPatient` call
        data = abi.encodeWithSignature(
            "addPatient(address,string,uint8,string,string,string,string,string)",
            patientAddress,
            name,
            age,
            phoneNumber,
            homeAddress,
            prescription,
            medicalTestResults,
            medicalConditions
        );

    // Cast the payable address to PatientProxy type to call executeTransaction()
    PatientProxy(proxyAddress).executeTransaction(patientRecordsContract, data, 0);
}

    // Generate the proxy contract bytecode
    function getProxyBytecode(string memory patientPhoneNumber) public pure returns (bytes memory) {
        bytes memory bytecode = type(PatientProxy).creationCode;
        return abi.encodePacked(bytecode, abi.encode(patientPhoneNumber));  // Pass phone number as string
    }

    // Generate the unique address where the proxy will be deployed using CREATE2
    function getProxyAddress(string memory patientEmail, string memory phoneNumber) public view returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(patientEmail)); // Generate salt from patientEmail
        bytes memory bytecode = getProxyBytecode(phoneNumber); // Pass phone number as string

        // Calculate address using CREATE2
        return address(uint160(uint(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            salt,
            keccak256(bytecode)
        )))));
    }

    // Deploys the proxy contract for the patient and ensures 2 ether is sent to the proxy
    function createPatientProxy(string memory patientEmail, string memory phoneNumber) public payable onlyOwner returns (address) {
        require(msg.value >= 2 ether, "Insufficient funds to initialize the proxy with 2 Ether.");

        // Use phone number or a combination with patientEmail for consistent salt
        bytes32 salt = keccak256(abi.encodePacked(patientEmail, phoneNumber)); // Generate consistent salt
        bytes memory bytecode = getProxyBytecode(phoneNumber); // Pass phone number as string
        address proxyAddress;

        assembly {
            proxyAddress := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(proxyAddress)) {
                revert(0, 0)
            }
        }

        // Transfer 2 ether to the newly created proxy
        payable(proxyAddress).transfer(2 ether);

        allProxyAddresses.push(proxyAddress); // Store the created proxy address
        emit PatientProxyCreated(proxyAddress, phoneNumber);
        return proxyAddress;
    }

    // Function to get the balance of a specific proxy address
    function getProxyBalance(address proxyAddress) public view returns (uint256) {
        return proxyAddress.balance;
    }

    // Function to get the latest created proxy address
    function getLatestProxyAddress() public view returns (address) {
        require(allProxyAddresses.length > 0, "No proxies created yet.");
        return allProxyAddresses[allProxyAddresses.length - 1];
    }

    // Function to retrieve all created proxy addresses
    function getAllProxyAddresses() public view returns (address[] memory) {
        return allProxyAddresses;
    }
}

// The PatientProxy contract represents the managed address of the patient
contract PatientProxy {
    bytes32 public patientPhoneNumber;
    address public manager;  // The entity that manages the proxy

    event Received(address sender, uint256 amount);

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can perform this action.");
        _;
    }

    constructor(string memory _phoneNumber) {
        patientPhoneNumber = keccak256(abi.encodePacked(_phoneNumber)); // Convert phone number to bytes32
        manager = msg.sender;  // The creator of the proxy becomes the manager
    }

    // This function allows the proxy to execute transactions on behalf of the user
    function executeTransaction(address to, bytes memory data, uint256 value) external {
        require(to != address(0), "Invalid target address");
        require(address(this).balance >= value, "Insufficient balance in proxy");

        // Use `call` to execute the transaction from the proxy contract
        (bool success, ) = to.call{value: value}(data);
        require(success, "Transaction execution failed");
    }

    function autoExecuteAddPatient(
        address patientRecordsContract,
        address patientAddress,
        string memory name,
        uint8 age,
        string memory phoneNumber,
        string memory homeAddress,
        string memory prescription,
        string memory medicalTestResults,
        string memory medicalConditions
    ) public onlyManager {
        // Prepare the encoded data for the `addPatient` call
        bytes memory data = abi.encodeWithSignature(
            "addPatient(address,string,uint8,string,string,string,string,string)",
            patientAddress,
            name,
            age,
            phoneNumber,
            homeAddress,
            prescription,
            medicalTestResults,
            medicalConditions
        );

        // Execute the transaction with the proxy's balance
        (bool success, ) = patientRecordsContract.call{value: 0}(data);
        require(success, "Transaction execution failed");
    }

    
    function getBalance() public view returns (uint256) {
    return address(this).balance;
}

    // Function to get the address of this proxy contract
    function getProxyAddress() public view returns (address) {
        return address(this);
    }

    // Allow the contract to receive ETH
    receive() external payable {
    emit Received(msg.sender, msg.value);
}
}

interface AggregatorV3Interface {
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

contract MedicalPaymentEscrow {
    struct Appointment {
        address payable patient;
        uint256 deposit;
        bool isPaid;
    }

    address public owner;
    address payable public doctor;
    uint public serviceCostInUsd;
    
    AggregatorV3Interface internal priceFeed;

    mapping(uint256 => Appointment) public appointments;
    uint256 public nextAppointmentId;

    event PaymentDeposited(uint256 appointmentId, address patient, uint256 amount);
    event PaymentReleased(uint256 appointmentId, address to, uint256 amount);
    event PaymentRefunded(uint256 appointmentId, address to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action.");
        _;
    }

    modifier onlyDoctor() {
        require(msg.sender == doctor, "Only doctor can perform this action.");
        _;
    }

    constructor(
        address payable _doctor, 
        uint _serviceCostInUsd, 
        address _priceFeed
    ) {
        doctor = _doctor;
        owner = msg.sender;
        serviceCostInUsd = _serviceCostInUsd;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }
    
    function getEthPriceInUsd() public view returns (uint) {
        (, int price, , ,) = priceFeed.latestRoundData();
        return uint(price) / 10**8;  // ETH price in USD (converted from 8 decimals)
    }
    
    function calculateEtherAmount() public view returns (uint) {
        uint ethPrice = getEthPriceInUsd();
        return (serviceCostInUsd * 1 ether) / ethPrice;  // returns the amount of ether needed to match USD cost
    }

    function depositPayment() public payable {
        uint256 etherAmount = calculateEtherAmount();
        require(msg.value >= etherAmount, "Insufficient payment.");

        appointments[nextAppointmentId] = Appointment({
            patient: payable(msg.sender),
            deposit: msg.value,
            isPaid: false
        });

        emit PaymentDeposited(nextAppointmentId, msg.sender, msg.value);

        nextAppointmentId++;
    }

    function getLastAppointmentId() public view returns (uint256) {
        require(nextAppointmentId > 0, "No appointments created yet.");
        return nextAppointmentId - 1;
    }

    
    function releasePayment(uint256 appointmentId) public onlyDoctor {
        Appointment storage appointment = appointments[appointmentId];
        require(appointment.deposit > 0, "No deposit for this appointment.");
        require(!appointment.isPaid, "Payment already released.");

        appointment.isPaid = true;
        doctor.transfer(appointment.deposit);

        emit PaymentReleased(appointmentId, doctor, appointment.deposit);
    }
    
    function refundPayment(uint256 appointmentId) public {
        Appointment storage appointment = appointments[appointmentId];
        require(msg.sender == appointment.patient, "Only the patient can request a refund.");
        require(appointment.deposit > 0, "No deposit for this appointment.");
        require(!appointment.isPaid, "Payment already released.");

        uint256 refundAmount = appointment.deposit;
        appointment.deposit = 0;

        appointment.patient.transfer(refundAmount);

        emit PaymentRefunded(appointmentId, appointment.patient, refundAmount);
    }
    
    receive() external payable {}
}
