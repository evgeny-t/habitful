import logging

from flask import Flask, render_template, request, make_response
import os.path

current_dir = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, \
  template_folder=os.path.join(current_dir, 'src'), \
  )

@app.route('/', defaults={ 'path': '' })
@app.route('/<path:path>')
def all(path):
  fn = 'src/public' + request.path
  if (os.path.exists(fn) and not os.path.isdir(fn)):
    return make_response(open(fn).read())
  return make_response(open('src/index.html').read())

@app.errorhandler(500)
def server_error(e):
  logging.exception('An error occurred during a request.')
  return 'An internal error occurred.', 500
