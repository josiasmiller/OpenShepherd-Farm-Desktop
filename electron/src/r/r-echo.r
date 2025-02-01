transient <- commandArgs(trailingOnly = TRUE)[1]
write(sprintf("{ \"message\": \"R says: %s %s %s %s\" }", transient, transient, transient, transient), stdout())
