# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup with Skote React theme
- PrimeReact and PrimeFlex integration for UI components
- Basic project structure following best practices
- Development environment configuration
- Project documentation in README.md
- Babel configuration for proper JSX handling
- Redux setup with redux-thunk middleware
- Reselect for memoized Redux selectors
- Axios and axios-mock-adapter for API mocking
- Added Skote theme dependencies:
  - i18next and react-i18next for internationalization
  - formik and yup for form validation
  - reactstrap for Bootstrap components
  - simplebar-react for custom scrollbars
  - metismenujs for menu management
  - classnames for conditional class names
  - lodash for utility functions
- Added charting libraries:
  - Chart.js and react-chartjs-2
  - Apexcharts and react-apexcharts
  - Chartist and react-chartist
- Added Bootstrap SCSS support with sass compiler

### Changed
- Removed TailwindCSS dependencies in favor of PrimeReact/PrimeFlex
- Updated package.json with stable dependency versions
- Configured ESLint for TypeScript and React
- Enhanced Vite configuration for better JSX/TSX support
- Added explicit file extensions resolution in Vite config
- Migrated from redux-saga to redux-thunk for simpler state management
- Added package overrides to enforce newer versions of dependencies
- Used legacy peer dependencies to resolve conflicts

### Fixed
- Vite pre-transform issues with JSX files
- Build configuration for mixed JavaScript/TypeScript codebase
- Missing Redux dependencies
- Store configuration issues
- Missing reselect dependency for Redux selectors
- High severity vulnerability in cross-spawn package
- Added overrides for undici to address security vulnerabilities
- Missing Skote theme dependencies causing build failures
- SCSS compilation issues by adding sass compiler

### Security
- Fixed high severity ReDoS vulnerability in cross-spawn
- Added package overrides to enforce newer versions of dependencies
- Addressed moderate severity vulnerabilities where possible
- Used --legacy-peer-deps to resolve dependency conflicts safely

### Removed
- TailwindCSS configuration files
- Unused Firebase configuration
- Redux-saga implementation

## [0.0.1] - 2025-02-13

### Added
- Initial project scaffolding
- Basic dependencies setup
- Core project structure
- Development environment configuration

### Technical Details
- React 18.3.1
- PrimeReact 10.5.1
- TypeScript support
- Vite as build tool
- ESLint for code quality
- Integration with Skote theme

## [1.3.0] - 2025-02-16
### Added
- Path aliases configuration...
