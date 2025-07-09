
# Use the official MongoDB image as the base image
FROM mongo:latest

# Expose the default MongoDB port
EXPOSE 27017

# The CMD instruction is not strictly necessary as the base image already defines it
# CMD ["mongod"]
