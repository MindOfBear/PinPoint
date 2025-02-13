import 'font-awesome/css/font-awesome.min.css';

export default function ApplicationLogo(props) {
    return (
        <div className="flex items-center space-x-3 cursor-pointer">
        <i className="fa fa-map-pin text-blue-500" />
        <p className="text-3xl text-gray-700 font-semibold">
          PinPoint
        </p>
      </div>
    );
}
