require 'haml'
require 'bandcamp'
require 'yaml'

class Vacationists < Sinatra::Base
  set :haml, :format => :html5
  set :root, File.dirname(__FILE__)

  before do
    Bandcamp::Base.api_key = "loggjafarisvindrukkinnlokna"
  end

  get '/' do
    @album = load_album("266867348")
    haml :index
  end

  def load_album(album_id)
    album = Bandcamp::Album.load(album_id)
  end
end
